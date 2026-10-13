import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useApi } from "../lib/useApi";
import MapPicker from "../components/MapPicker";

const LIBRARIES = ["places"];

const RIDE_TYPES = [
  { id: "standard", label: "Standard", desc: "Affordable everyday rides" },
  { id: "premium", label: "Premium", desc: "Comfortable newer cars" },
  { id: "xl", label: "XL", desc: "Extra space for up to 6" },
];

const toPlace = (place) =>
  place?.geometry
    ? {
        address: place.formatted_address || place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    : null;

export default function BookRide() {
  const api = useApi();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const pickupAc = useRef(null);
  const dropoffAc = useRef(null);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [directions, setDirections] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [rideType, setRideType] = useState("standard");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  // Changing a place clears the old route and fares right away
  const changePickup = (place) => {
    setPickup(place);
    setDirections(null);
    setEstimate(null);
  };
  const changeDropoff = (place) => {
    setDropoff(place);
    setDirections(null);
    setEstimate(null);
  };

  useEffect(() => {
    if (!isLoaded || !pickup || !dropoff) return;
    let cancelled = false;

    new window.google.maps.DirectionsService().route(
      {
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: { lat: dropoff.lat, lng: dropoff.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (!cancelled && status === "OK") setDirections(result);
      }
    );

    const q = new URLSearchParams({
      plat: pickup.lat,
      plng: pickup.lng,
      dlat: dropoff.lat,
      dlng: dropoff.lng,
    });
    api(`/api/rides/estimate?${q}`)
      .then((data) => {
        if (!cancelled) setEstimate(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, pickup, dropoff, api]);

  const book = async () => {
    setBooking(true);
    setError("");
    try {
      const ride = await api("/api/rides", {
        method: "POST",
        body: JSON.stringify({ pickup, dropoff, ride_type: rideType }),
      });
      navigate(`/rides/${ride.id}`);
    } catch (e) {
      setError(e.message);
      setBooking(false);
    }
  };

  if (loadError) return <p className="text-red-600">Failed to load Google Maps. Check your API key.</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  const input = "w-full rounded border p-2";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Book a ride</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <Autocomplete
          onLoad={(ac) => (pickupAc.current = ac)}
          onPlaceChanged={() => changePickup(toPlace(pickupAc.current.getPlace()))}
        >
          <input className={input} placeholder="Pickup location" onChange={() => changePickup(null)} />
        </Autocomplete>
        <Autocomplete
          onLoad={(ac) => (dropoffAc.current = ac)}
          onPlaceChanged={() => changeDropoff(toPlace(dropoffAc.current.getPlace()))}
        >
          <input className={input} placeholder="Drop-off location" onChange={() => changeDropoff(null)} />
        </Autocomplete>
      </div>

      <MapPicker pickup={pickup} dropoff={dropoff} directions={directions} />

      {estimate && (
        <section className="space-y-2">
          <p className="text-sm text-gray-600">Approx. distance: {estimate.distanceKm} km</p>
          {RIDE_TYPES.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 ${
                rideType === t.id ? "border-black" : ""
              }`}
            >
              <div>
                <input
                  type="radio"
                  name="rideType"
                  className="mr-2"
                  checked={rideType === t.id}
                  onChange={() => setRideType(t.id)}
                />
                <span className="font-medium">{t.label}</span>
                <p className="ml-5 text-sm text-gray-500">{t.desc}</p>
              </div>
              <span className="font-semibold">₹{estimate.fares[t.id].toFixed(2)}</span>
            </label>
          ))}
        </section>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={book}
        disabled={!pickup || !dropoff || !estimate || booking}
        className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {booking ? "Requesting..." : "Confirm ride"}
      </button>
    </div>
  );
}
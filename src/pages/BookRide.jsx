import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../lib/useApi";
import GoogleLocationPicker from "../components/GoogleLocationPicker";
import OsmLocationPicker from "../components/OsmLocationPicker";

// VITE_MAP_PROVIDER=google uses Google Maps, anything else uses OpenStreetMap
const LocationPicker =
  import.meta.env.VITE_MAP_PROVIDER === "google" ? GoogleLocationPicker : OsmLocationPicker;

const RIDE_TYPES = [
  { id: "standard", label: "Standard", desc: "Affordable everyday rides" },
  { id: "premium", label: "Premium", desc: "Comfortable newer cars" },
  { id: "xl", label: "XL", desc: "Extra space for up to 6" },
];

export default function BookRide() {
  const api = useApi();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [rideType, setRideType] = useState("standard");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const changePickup = (place) => {
    setPickup(place);
    setEstimate(null);
  };
  const changeDropoff = (place) => {
    setDropoff(place);
    setEstimate(null);
  };

  useEffect(() => {
    if (!pickup || !dropoff) return;
    let cancelled = false;

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
  }, [pickup, dropoff, api]);

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Book a ride</h1>

      <LocationPicker
        pickup={pickup}
        dropoff={dropoff}
        onPickup={changePickup}
        onDropoff={changeDropoff}
      />

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
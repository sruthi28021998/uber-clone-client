import { useJsApiLoader } from "@react-google-maps/api";
import MapPicker from "./MapPicker";
import PlaceInput from "./PlaceInput";

const LIBRARIES = ["places"];

export default function GoogleLocationPicker({ pickup, dropoff, onPickup, onDropoff }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  if (loadError) {
    return <p className="text-red-600">Failed to load Google Maps. Check your API key and billing.</p>;
  }
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <PlaceInput
          placeholder="Pickup location"
          onSelect={onPickup}
          onClear={() => onPickup(null)}
        />
        <PlaceInput
          placeholder="Drop-off location"
          onSelect={onDropoff}
          onClear={() => onDropoff(null)}
        />
      </div>
      <MapPicker pickup={pickup} dropoff={dropoff} />
    </>
  );
}
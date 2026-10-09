import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 20, lng: 0 };

export default function MapPicker({ pickup, dropoff, directions }) {
  const center = pickup ? { lat: pickup.lat, lng: pickup.lng } : DEFAULT_CENTER;

  return (
    <GoogleMap
      mapContainerClassName="h-72 w-full rounded-lg"
      center={center}
      zoom={pickup ? 13 : 2}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {directions ? (
        <DirectionsRenderer directions={directions} />
      ) : (
        <>
          {pickup && <Marker position={{ lat: pickup.lat, lng: pickup.lng }} label="A" />}
          {dropoff && <Marker position={{ lat: dropoff.lat, lng: dropoff.lng }} label="B" />}
        </>
      )}
    </GoogleMap>
  );
}
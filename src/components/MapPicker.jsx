import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 20, lng: 0 };

export default function MapPicker({ pickup, dropoff }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) return;
    if (pickup && dropoff) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
      bounds.extend({ lat: dropoff.lat, lng: dropoff.lng });
      map.fitBounds(bounds, 60);
    } else if (pickup || dropoff) {
      const p = pickup || dropoff;
      map.panTo({ lat: p.lat, lng: p.lng });
      map.setZoom(14);
    }
  }, [map, pickup, dropoff]);

  return (
    <GoogleMap
      mapContainerClassName="h-72 w-full rounded-lg"
      center={DEFAULT_CENTER}
      zoom={2}
      onLoad={setMap}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {pickup && <Marker position={{ lat: pickup.lat, lng: pickup.lng }} label="A" />}
      {dropoff && <Marker position={{ lat: dropoff.lat, lng: dropoff.lng }} label="B" />}
      {pickup && dropoff && (
        <Polyline
          path={[
            { lat: pickup.lat, lng: pickup.lng },
            { lat: dropoff.lat, lng: dropoff.lng },
          ]}
          options={{ strokeColor: "#000000", strokeWeight: 4 }}
        />
      )}
    </GoogleMap>
  );
}
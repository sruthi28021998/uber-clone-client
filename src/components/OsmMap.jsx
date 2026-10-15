import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function OsmMap({ pickup, dropoff }) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);

  useEffect(() => {
    map.current = L.map(el.current).setView([20, 0], 2);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    layer.current.clearLayers();

    const points = [];
    [
      [pickup, "A"],
      [dropoff, "B"],
    ].forEach(([place, label]) => {
      if (!place) return;
      const latLng = [place.lat, place.lng];
      points.push(latLng);
      L.circleMarker(latLng, { radius: 8, color: "#000", fillColor: "#000", fillOpacity: 1 })
        .bindTooltip(label, { permanent: true, direction: "top" })
        .addTo(layer.current);
    });

    if (points.length === 2) {
      L.polyline(points, { color: "#000", weight: 4 }).addTo(layer.current);
      map.current.fitBounds(points, { padding: [40, 40] });
    } else if (points.length === 1) {
      map.current.setView(points[0], 14);
    }
  }, [pickup, dropoff]);

  return <div ref={el} className="h-72 w-full rounded-lg" />;
}
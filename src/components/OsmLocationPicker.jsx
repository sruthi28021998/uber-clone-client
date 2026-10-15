import OsmMap from "./OsmMap";
import OsmPlaceSearch from "./OsmPlaceSearch";

export default function OsmLocationPicker({ pickup, dropoff, onPickup, onDropoff }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <OsmPlaceSearch
          placeholder="Pickup location"
          onSelect={onPickup}
          onClear={() => onPickup(null)}
        />
        <OsmPlaceSearch
          placeholder="Drop-off location"
          onSelect={onDropoff}
          onClear={() => onDropoff(null)}
        />
      </div>
      <OsmMap pickup={pickup} dropoff={dropoff} />
    </>
  );
}
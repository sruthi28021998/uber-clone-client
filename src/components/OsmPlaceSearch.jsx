import { useState } from "react";

// Free place search (OpenStreetMap Nominatim): search on Enter, no autocomplete
export default function OsmPlaceSearch({ placeholder, onSelect, onClear }) {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const search = async (e) => {
    e.preventDefault();
    if (text.trim().length < 3) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(text.trim())}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
      if (!data.length) setMessage("No places found. Try a more specific name.");
    } catch {
      setResults([]);
      setMessage("Search failed. Wait a moment and try again.");
    } finally {
      setBusy(false);
    }
  };

  const choose = (r) => {
    setText(r.display_name);
    setResults([]);
    onSelect({ address: r.display_name, lat: Number(r.lat), lng: Number(r.lon) });
  };

  return (
    <div>
      <form onSubmit={search} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onClear();
          }}
          placeholder={placeholder}
          className="w-full rounded border p-2"
        />
        <button disabled={busy} className="rounded bg-black px-3 text-white disabled:opacity-50">
          {busy ? "..." : "Search"}
        </button>
      </form>
      {results.length > 0 && (
        <ul className="mt-1 max-h-60 overflow-auto rounded border bg-white shadow">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                onClick={() => choose(r)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-1 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
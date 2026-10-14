import { useEffect, useRef, useState } from "react";

// Place search box using the Google Places API (New)
export default function PlaceInput({ placeholder, onSelect, onClear }) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const token = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const search = (value) => {
    clearTimeout(timer.current);
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          await window.google.maps.importLibrary("places");
        if (!token.current) token.current = new AutocompleteSessionToken();
        const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          sessionToken: token.current,
        });
        setSuggestions(result.suggestions.filter((s) => s.placePrediction));
        setError("");
      } catch {
        setSuggestions([]);
        setError("Could not load suggestions. Check your Google Maps key and billing.");
      }
    }, 300);
  };

  const onChange = (e) => {
    const value = e.target.value;
    setText(value);
    setOpen(true);
    onClear();
    search(value);
  };

  const choose = async (suggestion) => {
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ["displayName", "formattedAddress", "location"] });
      token.current = null; // a session ends once details are fetched
      const address = place.formattedAddress || place.displayName;
      setText(address);
      setSuggestions([]);
      setOpen(false);
      onSelect({ address, lat: place.location.lat(), lng: place.location.lng() });
    } catch {
      setError("Could not load that place. Try another one.");
    }
  };

  return (
    <div className="relative">
      <input
        value={text}
        onChange={onChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full rounded border p-2"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(s)}
                className="block w-full px-3 py-2 text-left hover:bg-gray-100"
              >
                {s.placePrediction.text.toString()}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
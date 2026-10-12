export default function RatingStars({ value = 0, onChange, size = "text-2xl" }) {
  return (
    <div className={`flex ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const color = n <= value ? "text-yellow-500" : "text-gray-300";
        return onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className={color}
          >
            ★
          </button>
        ) : (
          <span key={n} className={color}>★</span>
        );
      })}
    </div>
  );
}
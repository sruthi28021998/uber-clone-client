import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../lib/useApi";
import RatingStars from "../components/RatingStars";

export default function DriverProfile() {
  const { id } = useParams();
  const api = useApi();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/reviews/driver/${id}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [api, id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { driver, average, reviewCount, reviews } = data;

  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center gap-4">
        {driver.image_url ? (
          <img src={driver.image_url} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-xl">
            {(driver.name ?? "D")[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{driver.name ?? "Driver"}</h1>
          {reviewCount ? (
            <div className="flex items-center gap-2">
              <RatingStars value={Math.round(average)} size="text-xl" />
              <span className="text-sm text-gray-600">
                {average.toFixed(1)} ({reviewCount} review{reviewCount === 1 ? "" : "s"})
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ratings yet</p>
          )}
        </div>
      </div>

      <section className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <RatingStars value={r.rating} size="text-base" />
              <span className="text-xs text-gray-500">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
            <p className="mt-1 text-xs text-gray-500">— {r.riderName}</p>
          </div>
        ))}
      </section>

      <Link to="/dashboard" className="text-sm underline">Back to dashboard</Link>
    </div>
  );
}
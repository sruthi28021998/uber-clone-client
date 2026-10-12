import { useEffect, useState } from "react";
import { useApi } from "../lib/useApi";
import RatingStars from "./RatingStars";

// Shown to the rider on a completed ride: the review form, or their saved review
export default function RideReview({ ride, onDone }) {
  const api = useApi();
  const [me, setMe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/users/me").then(setMe).catch(() => {});
  }, [api]);

  if (!me || me.id !== ride.rider_id) return null;
  if (ride.status !== "completed" || !ride.driver_id) return null;

  const review = Array.isArray(ride.review) ? ride.review[0] : ride.review;
  if (review) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <p className="text-sm text-gray-500">Your rating</p>
        <RatingStars value={review.rating} size="text-xl" />
        {review.comment && <p className="mt-1 text-sm">{review.comment}</p>}
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please choose a star rating");
    setBusy(true);
    setError("");
    try {
      await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ ride_id: ride.id, rating, comment }),
      });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg bg-white p-4 shadow">
      <p className="font-medium">How was your ride?</p>
      <RatingStars value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Leave a comment (optional)"
        className="w-full rounded border p-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {busy ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
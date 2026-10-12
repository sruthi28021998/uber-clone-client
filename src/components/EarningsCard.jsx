import { useEffect, useState } from "react";
import { useApi } from "../lib/useApi";
import StatCard from "./StatCard";

export default function EarningsCard() {
  const api = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([api("/api/payments/earnings"), api("/api/reviews/driver/me")])
      .then(([earnings, rating]) => setData({ ...earnings, rating }))
      .catch(console.error);
  }, [api]);

  if (!data) return null;

  const { rating } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Total earnings" value={`₹${data.total.toFixed(2)}`} />
      <StatCard label="Paid rides" value={data.paidRides} />
      <StatCard
        label="Rating"
        value={rating.reviewCount ? `★ ${rating.average.toFixed(1)} (${rating.reviewCount})` : "No ratings yet"}
      />
    </div>
  );
}
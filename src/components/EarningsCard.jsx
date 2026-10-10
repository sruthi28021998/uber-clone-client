import { useEffect, useState } from "react";
import { useApi } from "../lib/useApi";
import StatCard from "./StatCard";

export default function EarningsCard() {
  const api = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/api/payments/earnings").then(setData).catch(console.error);
  }, [api]);

  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard label="Total earnings" value={`$${data.total.toFixed(2)}`} />
      <StatCard label="Paid rides" value={data.paidRides} />
    </div>
  );
}
import { useState } from "react";
import { useApi } from "../lib/useApi";

export default function PayForRide({ ride }) {
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const { url } = await api("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ ride_id: ride.id }),
      });
      window.location.href = url; // go to Stripe's payment page
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={pay}
        disabled={busy}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "Redirecting to Stripe..." : `Pay ₹${Number(ride.fare).toFixed(2)} with Stripe`}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
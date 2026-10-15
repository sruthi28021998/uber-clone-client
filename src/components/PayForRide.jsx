import { useState } from "react";
import { useApi } from "../lib/useApi";

export default function PayForRide({ ride, onPaid }) {
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [demoOrder, setDemoOrder] = useState(null);

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await api("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ ride_id: ride.id }),
      });
      if (data.demo) {
        setDemoOrder(data.orderId);
        setBusy(false);
        return;
      }
      window.location.href = data.url; // Stripe's payment page
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const completeDemo = async () => {
    setBusy(true);
    setError("");
    try {
      await api("/api/payments/confirm", {
        method: "POST",
        body: JSON.stringify({ demo_order_id: demoOrder }),
      });
      onPaid?.();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (demoOrder) {
    return (
      <div className="space-y-2 rounded-lg border border-yellow-400 bg-yellow-50 p-4">
        <p className="font-medium">Demo payment</p>
        <p className="text-sm text-gray-700">
          Stripe isn't connected yet, so this simulates a payment of ₹{Number(ride.fare).toFixed(2)}.
          No card is charged.
        </p>
        <button
          onClick={completeDemo}
          disabled={busy}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {busy ? "Processing..." : "Complete demo payment"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={pay}
        disabled={busy}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "Please wait..." : `Pay ₹${Number(ride.fare).toFixed(2)}`}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
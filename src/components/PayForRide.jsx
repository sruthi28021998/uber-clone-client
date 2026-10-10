import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useApi } from "../lib/useApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (stripeError) {
      setError(stripeError.message);
      setBusy(false);
      return;
    }

    try {
      await api("/api/payments/confirm", {
        method: "POST",
        body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
      });
      onPaid();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={!stripe || busy}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {busy ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

export default function PayForRide({ ride, onPaid }) {
  const api = useApi();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");

  const start = async () => {
    setError("");
    try {
      const data = await api("/api/payments/intent", {
        method: "POST",
        body: JSON.stringify({ ride_id: ride.id }),
      });
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!clientSecret) {
    return (
      <div className="space-y-2">
        <button onClick={start} className="rounded bg-black px-4 py-2 text-white">
          Pay ${Number(ride.fare).toFixed(2)}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onPaid={onPaid} />
    </Elements>
  );
}
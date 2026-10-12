import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const FEATURES = [
  { icon: "📍", title: "Instant fare estimates", text: "See the route and price for every ride type before you book." },
  { icon: "⚡", title: "Live ride updates", text: "Get notified the moment a driver accepts, starts and finishes your ride." },
  { icon: "💳", title: "Easy payments", text: "Pay securely after your ride and get a receipt by email." },
];

export default function Home() {
  return (
    <div className="space-y-12 py-8 sm:py-16">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Go anywhere with RideNow</h1>
        <p className="mx-auto max-w-xl text-gray-600">
          Request a ride, hop in, and go. Drivers near you are ready in minutes.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <SignedOut>
            <Link to="/sign-up" className="rounded bg-black px-6 py-3 text-white">Get started</Link>
            <Link to="/sign-in" className="rounded border px-6 py-3">Sign in</Link>
          </SignedOut>
          <SignedIn>
            <Link to="/book" className="rounded bg-black px-6 py-3 text-white">Book a ride</Link>
            <Link to="/dashboard" className="rounded border px-6 py-3">Go to dashboard</Link>
          </SignedIn>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg bg-white p-6 shadow">
            <div className="text-3xl">{f.icon}</div>
            <h2 className="mt-3 font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
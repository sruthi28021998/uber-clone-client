import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-5xl font-bold">Go anywhere with RideNow</h1>
      <p className="mt-4 text-gray-600">Request a ride, hop in, and go.</p>
      <Link to="/dashboard" className="mt-8 inline-block rounded bg-black px-6 py-3 text-white">
        Get started
      </Link>
    </section>
  );
}
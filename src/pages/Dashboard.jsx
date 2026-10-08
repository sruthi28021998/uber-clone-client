import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../lib/useApi";
import StatCard from "../components/StatCard";
import RideCard from "../components/RideCard";

export default function Dashboard() {
  const api = useApi();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api("/api/users/me"), api("/api/rides")])
      .then(([u, r]) => {
        setUser(u);
        setRides(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <p>Loading...</p>;

  const completed = rides.filter((r) => r.status === "completed");
  const spent = completed.reduce((sum, r) => sum + Number(r.fare ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi, {user?.name ?? "there"} 👋</h1>
        <p className="capitalize text-gray-600">Signed in as {user?.role}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total rides" value={rides.length} />
        <StatCard label="Completed" value={completed.length} />
        <StatCard label="Total" value={`$${spent.toFixed(2)}`} />
      </div>

      <div className="flex gap-3">
        <Link to="/book" className="rounded bg-black px-4 py-2 text-white">Book a ride</Link>
        <Link to="/profile" className="rounded border px-4 py-2">Edit profile</Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent rides</h2>
        {rides.length === 0 ? (
          <p className="text-gray-500">No rides yet.</p>
        ) : (
          rides.slice(0, 5).map((ride) => <RideCard key={ride.id} ride={ride} />)
        )}
      </section>
    </div>
  );
}
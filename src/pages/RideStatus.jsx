import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { useSocket } from "../lib/SocketContext";

const STEPS = [
  { key: "requested", label: "Looking for a driver" },
  { key: "accepted", label: "Driver is on the way" },
  { key: "in_progress", label: "Ride in progress" },
  { key: "completed", label: "Ride completed" },
];

export default function RideStatus() {
  const { id } = useParams();
  const api = useApi();
  const socket = useSocket();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(
    () => api(`/api/rides/${id}`).then(setRide).catch((e) => setError(e.message)),
    [api, id]
  );

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (r) => r.id === id && load();
    socket.on("ride:updated", onUpdate);
    return () => socket.off("ride:updated", onUpdate);
  }, [socket, id, load]);

  const cancel = async () => {
    try {
      await api(`/api/rides/${id}/cancel`, { method: "PATCH" });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!ride) return <p>Loading...</p>;

  const current = STEPS.findIndex((s) => s.key === ride.status);

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Your ride</h1>
      <p>{ride.pickup_address} → {ride.dropoff_address}</p>

      {ride.status === "cancelled" ? (
        <p className="rounded bg-red-100 p-3 text-red-800">This ride was cancelled.</p>
      ) : (
        <ol className="space-y-2">
          {STEPS.map((s, i) => (
            <li key={s.key} className={i <= current ? "font-semibold" : "text-gray-400"}>
              {i <= current ? "✅" : "⬜"} {s.label}
            </li>
          ))}
        </ol>
      )}

      {ride.driver && (
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Your driver</p>
          <p className="font-medium">{ride.driver.name ?? "Driver"}</p>
          {ride.driver.phone && <p className="text-sm">{ride.driver.phone}</p>}
        </div>
      )}

      <p className="font-semibold">Fare: ${ride.fare}</p>

      {(ride.status === "requested" || ride.status === "accepted") && (
        <button onClick={cancel} className="rounded border border-red-600 px-4 py-2 text-red-600">
          Cancel ride
        </button>
      )}

      <div>
        <Link to="/dashboard" className="text-sm underline">Back to dashboard</Link>
      </div>
    </div>
  );
}
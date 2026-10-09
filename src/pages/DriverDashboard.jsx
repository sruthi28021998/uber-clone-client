import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../lib/useApi";
import { useSocket } from "../lib/SocketContext";

export default function DriverDashboard() {
  const api = useApi();
  const socket = useSocket();
  const [user, setUser] = useState(null);
  const [available, setAvailable] = useState([]);
  const [active, setActive] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const me = await api("/api/users/me");
      setUser(me);
      if (me.role !== "driver") return;
      const [act, avail] = await Promise.all([
        api("/api/drivers/rides/active"),
        me.is_online ? api("/api/drivers/rides/available") : [],
      ]);
      setActive(act);
      setAvailable(avail);
    } catch (e) {
      setError(e.message);
    }
  }, [api]);

  // Refresh every 10 seconds (also works without sockets)
  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  // Instant refresh when the server pushes an event
  useEffect(() => {
    if (!socket) return;
    socket.on("ride:new", load);
    socket.on("ride:taken", load);
    socket.on("ride:updated", load);
    return () => {
      socket.off("ride:new", load);
      socket.off("ride:taken", load);
      socket.off("ride:updated", load);
    };
  }, [socket, load]);

  const setOnline = async (online) => {
    setError("");
    try {
      let coords = {};
      if (online) {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          })
        );
        coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      }
      await api("/api/drivers/status", {
        method: "PATCH",
        body: JSON.stringify({ is_online: online, ...coords }),
      });
      load();
    } catch (e) {
      setError(e.message || "Could not get your location");
    }
  };

  const act = async (path, body = {}) => {
    setError("");
    try {
      await api(path, { method: "PATCH", body: JSON.stringify(body) });
    } catch (e) {
      setError(e.message);
    }
    load();
  };

  if (!user) return <p>Loading...</p>;

  if (user.role !== "driver") {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Driver dashboard</h1>
        <p>Your account is set up as a rider.</p>
        <Link to="/profile" className="inline-block rounded bg-black px-4 py-2 text-white">
          Switch to Driver in Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Driver dashboard</h1>
        <button
          onClick={() => setOnline(!user.is_online)}
          className={`rounded px-4 py-2 text-white ${user.is_online ? "bg-green-600" : "bg-gray-600"}`}
        >
          {user.is_online ? "Online" : "Offline"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {active && (
        <section className="space-y-2 rounded-lg border-2 border-black bg-white p-4">
          <h2 className="font-semibold">Current ride</h2>
          <p>{active.pickup_address} → {active.dropoff_address}</p>
          <p className="text-sm text-gray-600">
            Rider: {active.rider?.name ?? "Rider"} {active.rider?.phone && `· ${active.rider.phone}`}
          </p>
          <p className="font-semibold">${active.fare}</p>
          {active.status === "accepted" ? (
            <button
              onClick={() => act(`/api/drivers/rides/${active.id}/status`, { status: "in_progress" })}
              className="rounded bg-black px-4 py-2 text-white"
            >
              Start ride
            </button>
          ) : (
            <button
              onClick={() => act(`/api/drivers/rides/${active.id}/status`, { status: "completed" })}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Complete ride
            </button>
          )}
        </section>
      )}

      {!active && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Ride requests nearby</h2>
          {!user.is_online ? (
            <p className="text-gray-500">Go online to see ride requests.</p>
          ) : available.length === 0 ? (
            <p className="text-gray-500">No requests within 10 km right now.</p>
          ) : (
            available.map((ride) => (
              <div key={ride.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
                <div>
                  <p className="font-medium">{ride.pickup_address} → {ride.dropoff_address}</p>
                  <p className="text-sm text-gray-500">
                    {ride.distanceToPickupKm} km away · {ride.ride_type} · ${ride.fare}
                  </p>
                </div>
                <button
                  onClick={() => act(`/api/drivers/rides/${ride.id}/accept`)}
                  className="rounded bg-black px-4 py-2 text-white"
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}
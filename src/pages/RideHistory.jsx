import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../lib/useApi";
import RideCard from "../components/RideCard";

const FILTERS = ["all", "completed", "cancelled"];

export default function RideHistory() {
  const api = useApi();
  const { getToken } = useAuth();
  const [me, setMe] = useState(null);
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api("/api/users/me"), api("/api/rides")])
      .then(([u, r]) => {
        setMe(u);
        setRides(r);
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [api]);

  const download = async (id) => {
    setMessage("");
    const token = await getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/receipts/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return setMessage("Could not download the receipt");

    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${id.slice(0, 8)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const emailReceipt = async (id) => {
    setMessage("");
    try {
      await api(`/api/receipts/${id}/email`, { method: "POST" });
      setMessage("Receipt sent to your email ✅");
    } catch (e) {
      setMessage(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  const visible = rides.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ride history</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1 text-sm capitalize ${
              filter === f ? "bg-black text-white" : "border bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {message && <p className="text-sm">{message}</p>}

      {visible.length === 0 ? (
        <p className="text-gray-500">No rides to show.</p>
      ) : (
        visible.map((ride) => {
          const paid = ride.payments?.some((p) => p.status === "succeeded");
          const isRider = me && ride.rider_id === me.id;
          return (
            <div key={ride.id} className="space-y-2">
              <Link to={`/rides/${ride.id}`} className="block">
                <RideCard ride={ride} />
              </Link>
              <div className="flex flex-wrap items-center gap-3 px-1 text-sm">
                <span className="text-gray-500">{isRider ? "As rider" : "As driver"}</span>
                {ride.status === "completed" &&
                  (paid ? (
                    <>
                      <span className="text-green-700">Paid</span>
                      <button onClick={() => download(ride.id)} className="underline">
                        Download receipt
                      </button>
                      {isRider && (
                        <button onClick={() => emailReceipt(ride.id)} className="underline">
                          Email receipt
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-yellow-700">Payment pending</span>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
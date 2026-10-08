const colors = {
  requested: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function RideCard({ ride }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
      <div>
        <p className="font-medium">{ride.pickup_address} → {ride.dropoff_address}</p>
        <p className="text-sm text-gray-500">{new Date(ride.created_at).toLocaleString()}</p>
      </div>
      <div className="text-right">
        <span className={`rounded px-2 py-1 text-xs ${colors[ride.status]}`}>
          {ride.status.replace("_", " ")}
        </span>
        {ride.fare != null && <p className="mt-1 font-semibold">${ride.fare}</p>}
      </div>
    </div>
  );
}
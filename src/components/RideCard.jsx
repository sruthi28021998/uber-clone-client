const colors = {
  requested: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function RideCard({ ride }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="wrap-break-word font-medium">
          {ride.pickup_address} → {ride.dropoff_address}
        </p>
        <p className="text-sm text-gray-500">{new Date(ride.created_at).toLocaleString()}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
        <span className={`rounded px-2 py-1 text-xs ${colors[ride.status]}`}>
          {ride.status.replace("_", " ")}
        </span>
        {ride.fare != null && <p className="font-semibold sm:mt-1">{ride.fare}</p>}
      </div>
    </div>
  );
}
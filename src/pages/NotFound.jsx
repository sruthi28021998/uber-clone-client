import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="space-y-3 py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">This page doesn't exist.</p>
      <Link to="/" className="inline-block rounded bg-black px-4 py-2 text-white">Go home</Link>
    </div>
  );
}
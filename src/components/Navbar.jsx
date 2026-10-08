import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-black px-6 py-4 text-white">
      <Link to="/" className="text-xl font-bold">RideNow</Link>
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link to="/sign-in">Sign in</Link>
          <Link to="/sign-up" className="rounded bg-white px-3 py-1 text-black">Sign up</Link>
        </SignedOut>
        <SignedIn>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
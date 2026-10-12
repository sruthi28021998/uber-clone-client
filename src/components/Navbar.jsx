import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/book", label: "Book a ride" },
  { to: "/rides", label: "History" },
  { to: "/driver", label: "Drive" },
  { to: "/profile", label: "Profile" },
];

const linkClass = ({ isActive }) =>
  `rounded px-2 py-1 ${isActive ? "bg-white/20" : "hover:bg-white/10"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-black text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">RideNow</Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <Link to="/sign-in" className="px-2 py-1">Sign in</Link>
            <Link to="/sign-up" className="rounded bg-white px-3 py-1 text-black">Sign up</Link>
          </SignedOut>

          <SignedIn>
            <div className="hidden items-center gap-1 md:flex">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
              ))}
            </div>
            <UserButton />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="px-2 text-2xl md:hidden"
            >
              {open ? "✕" : "☰"}
            </button>
          </SignedIn>
        </div>
      </div>

      <SignedIn>
        {open && (
          <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-2 md:hidden">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </SignedIn>
    </nav>
  );
}
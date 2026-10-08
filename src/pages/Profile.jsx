import { useEffect, useState } from "react";
import { useApi } from "../lib/useApi";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  const api = useApi();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/api/users/me").then(setUser).catch(console.error);
  }, [api]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <ProfileForm user={user} onSaved={setUser} />
    </div>
  );
}
import { useState } from "react";
import { useApi } from "../lib/useApi";

export default function ProfileForm({ user, onSaved }) {
  const api = useApi();
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    image_url: user.image_url ?? "",
    role: user.role,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updated = await api("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      onSaved(updated);
      setMessage("Profile updated ✅");
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded border p-2";

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-lg bg-white p-6 shadow">
      {form.image_url && (
        <img src={form.image_url} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
      )}
      <div>
        <label className="mb-1 block text-sm">Name</label>
        <input name="name" value={form.name} onChange={onChange} className={input} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Phone number</label>
        <input name="phone" value={form.phone} onChange={onChange} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm">Profile picture URL</label>
        <input name="image_url" value={form.image_url} onChange={onChange} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm">I am a</label>
        <select name="role" value={form.role} onChange={onChange} className={input}>
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
        </select>
      </div>
      <button disabled={saving} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save changes"}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "./useApi";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { isSignedIn, getToken } = useAuth();
  const api = useApi();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isSignedIn) return;
    let s;
    let cancelled = false;

    (async () => {
      await api("/api/users/me"); // makes sure the DB user exists before connecting
      if (cancelled) return;

      s = io(import.meta.env.VITE_API_URL, {
        auth: (cb) => {
          getToken().then((token) => cb({ token }));
        },
      });
      s.on("notification", (n) => toast(n.message));
      setSocket(s);
    })().catch(console.error);

    return () => {
      cancelled = true;
      s?.disconnect();
      setSocket(null);
    };
  }, [isSignedIn, api, getToken]);

  return (
    <SocketContext.Provider value={socket}>
      <Toaster position="top-right" />
      {children}
    </SocketContext.Provider>
  );
}
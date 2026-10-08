import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}
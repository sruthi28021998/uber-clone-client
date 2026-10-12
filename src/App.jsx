import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const BookRide = lazy(() => import("./pages/BookRide"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const RideStatus = lazy(() => import("./pages/RideStatus"));
const RideHistory = lazy(() => import("./pages/RideHistory"));
const DriverProfile = lazy(() => import("./pages/DriverProfile"));

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute><BookRide /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
            <Route path="/rides" element={<ProtectedRoute><RideHistory /></ProtectedRoute>} />
            <Route path="/rides/:id" element={<ProtectedRoute><RideStatus /></ProtectedRoute>} />
            <Route path="/drivers/:id" element={<ProtectedRoute><DriverProfile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
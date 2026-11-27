// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navigation from "./components/navbar/Navigation";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import { cn } from "@/lib/utils";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage";

// Signed-in pages load on demand so the login and signup pages ship without them.
const HomePage = lazy(() => import("./pages/Home/home"));
const UploadPage = lazy(() => import("./pages/upload/UploadPage"));
const FilesPage = lazy(() => import("./pages/files/FilesPage"));
const MyUploadsPage = lazy(() => import("./pages/files/MyUploadsPage"));
const Profile = lazy(() => import("./pages/profile/Profile"));

function PageFallback() {
    return (
        <div className="page-fallback" role="status" aria-live="polite">
            <LoadingSpinner size="md" message="Loading…" />
        </div>
    );
}

// Protected = requires auth
function ProtectedRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
  return auth?.ok === true ? children : <Navigate to="/login" replace />;
}

// Public = only for unauthenticated users
function PublicRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
  return auth?.ok === true ? <Navigate to="/home" replace /> : children;
}

function AppRoutes() {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  // Each new page starts at the top (instant; smooth scrolling is for in-page jumps)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const loadAuth = () => {
      const stored = sessionStorage.getItem("auth");
      setAuth(stored ? JSON.parse(stored) : null);
    };

    loadAuth();
    window.addEventListener("authChange", loadAuth);
    return () => window.removeEventListener("authChange", loadAuth);
  }, []);

  const isLoggedIn = auth?.ok === true;

  return (
    <>
      {/* Navigation shown only when logged in and receives current user props */}
      {isLoggedIn && (
        <Navigation userName={auth.username || ""} userEmail={auth.email || ""} />
      )}

      <div key={location.pathname} className={cn("page-enter", isLoggedIn && "pb-24 md:pb-0 md:transition-[padding] md:duration-300 md:ease-out", isLoggedIn && "md:pl-[var(--sidebar-w,18rem)]")}>
      <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public landing */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <FilesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-uploads"
          element={
            <ProtectedRoute>
              <MyUploadsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback: send logged-in users to /home, others to landing */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} replace />} />
      </Routes>
      </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


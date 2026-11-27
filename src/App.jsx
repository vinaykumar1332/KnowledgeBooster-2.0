// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navigation from "./components/navbar/Navigation";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import { cn } from "@/lib/utils";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage";
import { ROUTES, STORAGE_KEYS, EVENTS } from "./constants";

// Signed-in pages load on demand so the login and signup pages ship without them.
const HomePage = lazy(() => import("./pages/Home/home"));
const UploadPage = lazy(() => import("./pages/upload/UploadPage"));
const FilesPage = lazy(() => import("./pages/files/FilesPage"));
const MyUploadsPage = lazy(() => import("./pages/files/MyUploadsPage"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const YouTubePage = lazy(() => import("./pages/youtube/YouTubePage"));

function PageFallback() {
    return (
        <div className="page-fallback" role="status" aria-live="polite">
            <LoadingSpinner size="md" message="Loading…" />
        </div>
    );
}

function readAuth() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.AUTH) || "null"); } catch { return null; }
}

// Protected = requires auth
function ProtectedRoute({ children }) {
  return readAuth()?.ok === true ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

// Public = only for unauthenticated users
function PublicRoute({ children }) {
  return readAuth()?.ok === true ? <Navigate to={ROUTES.HOME} replace /> : children;
}

function AppRoutes() {
  const [auth, setAuth] = useState(null);
  const location = useLocation();

  // Each new page starts at the top (instant; smooth scrolling is for in-page jumps)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const loadAuth = () => setAuth(readAuth());
    loadAuth();
    window.addEventListener(EVENTS.AUTH_CHANGE, loadAuth);
    return () => window.removeEventListener(EVENTS.AUTH_CHANGE, loadAuth);
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
        <Route path={ROUTES.LANDING}    element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path={ROUTES.LOGIN}     element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={ROUTES.SIGNUP}    element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path={ROUTES.HOME}      element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path={ROUTES.PROFILE}   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path={ROUTES.UPLOAD}    element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path={ROUTES.FILES}     element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
        <Route path={ROUTES.MY_UPLOADS} element={<ProtectedRoute><MyUploadsPage /></ProtectedRoute>} />
        <Route path={ROUTES.VIDEOS}    element={<ProtectedRoute><YouTubePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={isLoggedIn ? ROUTES.HOME : ROUTES.LANDING} replace />} />
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


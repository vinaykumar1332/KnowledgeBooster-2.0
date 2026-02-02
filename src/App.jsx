// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/navbar/Navigation";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/Home/home";

import UploadPage from "./pages/upload/UploadPage";
import FilesPage from "./pages/files/FilesPage";
import MyUploadsPage from "./pages/files/MyUploadsPage";
import Profile from "./pages/profile/Profile";

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

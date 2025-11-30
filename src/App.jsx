// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./components/navbar/Navigation";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Protected Route Component
function ProtectedRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
  return auth?.ok === true ? children : <Navigate to="/login" replace />;
}

// Dashboard Component (with logout)
function Dashboard() {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    // Trigger custom event so App re-renders immediately
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-20 px-6">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome back, {auth.username || "User"}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {auth.email}
          </p>
          <p className="text-lg text-gray-700 mb-10">
            This is your KnowledgeHub dashboard. You are successfully logged in.
          </p>

          <button
            onClick={handleLogout}
            className="auth-btn danger px-8 py-3 text-lg"
          >
            <i className="pi pi-sign-out mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(null);

  // Listen to auth changes (login, logout)
  useEffect(() => {
    const loadAuth = () => {
      const stored = sessionStorage.getItem("auth");
      setAuth(stored ? JSON.parse(stored) : null);
    };

    loadAuth();
    window.addEventListener("authChange", loadAuth);

    return () => window.removeEventListener("authChange", loadAuth);
  }, []);

  return (
    <BrowserRouter>
      {/* Show Navigation only when logged in */}
      {auth?.ok === true && (
        <Navigation userName={auth.username} userEmail={auth.email} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
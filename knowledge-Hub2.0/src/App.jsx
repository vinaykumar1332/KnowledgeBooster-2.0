// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./components/navbar/Navigation";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function ProtectedRoute({ children }) {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  return auth?.email ? children : <Navigate to="/login" replace />;
}

function App() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const loadAuth = () => {
      const stored = sessionStorage.getItem("auth");
      setAuth(stored ? JSON.parse(stored) : null);
    };

    loadAuth();
    window.addEventListener("authChange", loadAuth);
    return () => {
      window.removeEventListener("authChange", loadAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      {auth?.email && (
        <Navigation userName={auth.username} userEmail={auth.email} />
      )}

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-4">
                  Welcome, {auth?.username || ""}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  This is your KnowledgeHub dashboard.
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Any unknown route → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

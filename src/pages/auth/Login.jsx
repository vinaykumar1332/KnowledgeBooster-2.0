// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import ToastNotification from "../../components/toast/ToastNotification";
import { login } from "../../services/authService";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (msg, type = "error") => setToast({ message: msg, type });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return showToast("Fill all fields");

        setLoading(true);

        try {
            const data = await login({ email, password });

            if (!data.ok) {
                showToast(data.msg || "Invalid credentials");
                return;
            }
            sessionStorage.setItem("auth", JSON.stringify({ ok: true, token: data.token, username: data.username, email: data.email }));
            window.dispatchEvent(new Event("authChange"));

            showToast("Login successful!", "success");
            setTimeout(() => navigate("/home"), 600);
        } catch (err) {
            console.error("Login error:", err);
            showToast("Connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="auth-page">
                <div className="auth-card">
                    <h1>
                        <i className="pi pi-sign-in mr-2" />
                        Welcome Back
                    </h1>

                    <form onSubmit={handleLogin}>
                        <div className="field">
                            <label>
                                <i className="pi pi-envelope mr-2" />
                                Email
                            </label>
                            <InputText
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-lock mr-2" />
                                Password
                            </label>
                            <Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                feedback={false}
                                toggleMask
                            />
                        </div>

                        <button type="submit" className="btn-primary btn" disabled={loading}>
                            <span className="btn-text">{loading ? "Signing in..." : "Login"}</span>
                        </button>

                        <div className="auth-foot">
                            New here?
                            <button
                                type="button"
                                className="btn-secondary btn"
                                onClick={() => navigate("/signup")}
                            >
                                <span className="btn-text">Sign UP</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

/**
 * Improved Login Page
 * Uses new Button and Input components with UI config
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import ToastNotification from "../../components/toast/ToastNotification";

import { UI_CONFIG, getUIText } from "../../config/ui.config";
import { API_CONFIG, getAuthHeaders } from "../../config/Api.config";
import { useLocalStorage } from "../../hooks/useLocalStorage";

import "./login.css";

export default function Login() {
    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // UI state
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    // Hooks
    const navigate = useNavigate();
    const [savedEmail, setSavedEmail] = useLocalStorage("rememberedEmail", "");

    // Load remembered email on mount
    React.useEffect(() => {
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, [savedEmail]);

    // Validation
    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = getUIText("AUTH.LOGIN.ERROR_EMAIL_REQUIRED");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = getUIText("AUTH.LOGIN.ERROR_INVALID_EMAIL");
        }

        if (!password) {
            newErrors.password = getUIText("AUTH.LOGIN.ERROR_PASSWORD_REQUIRED");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Show toast
    const showToast = (message, type = "error") => {
        setToast({ message, type });
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(API_CONFIG.AUTH_URL, {
                method: "POST",
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    script: "AUTH",
                    action: "login",
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json().catch(() => ({
                ok: false,
                msg: getUIText("ERRORS.SERVER_ERROR"),
            }));

            if (!data.ok) {
                showToast(
                    data.msg || getUIText("AUTH.LOGIN.ERROR_INVALID_CREDENTIALS"),
                    "error"
                );
                return;
            }

            // Save to storage
            sessionStorage.setItem("auth", JSON.stringify(data));

            // Remember email if checked
            if (rememberMe) {
                setSavedEmail(email);
            } else {
                setSavedEmail("");
            }

            // Show success
            showToast(getUIText("AUTH.LOGIN.SUCCESS_MESSAGE"), "success");

            // Dispatch auth change event
            window.dispatchEvent(new Event("authChange"));

            // Redirect to home
            setTimeout(() => navigate("/home"), 800);
        } catch (err) {
            console.error("Login error:", err);
            showToast(getUIText("ERRORS.NETWORK_ERROR"), "error");
        } finally {
            setLoading(false);
        }
    };

    const LOGIN_UI = UI_CONFIG.AUTH.LOGIN;

    return (
        <div className="auth-page login-page">
            {/* Animated background */}
            <div className="auth-bg">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>

            {/* Toast notification */}
            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Loading overlay */}
            {loading && (
                <LoadingSpinner
                    variant="spinner"
                    message={LOGIN_UI.LOADING_MESSAGE}
                    fullScreen={true}
                />
            )}

            {/* Login card */}
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <h1 className="auth-title">{LOGIN_UI.TITLE}</h1>
                    <p className="auth-subtitle">{LOGIN_UI.SUBTITLE}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="auth-form">
                    {/* Email field */}
                    <Input
                        label={LOGIN_UI.EMAIL_LABEL}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        placeholder={LOGIN_UI.EMAIL_PLACEHOLDER}
                        icon={FiMail}
                        error={errors.email}
                        disabled={loading}
                        autoComplete="email"
                        required
                    />

                    {/* Password field */}
                    <Input
                        label={LOGIN_UI.PASSWORD_LABEL}
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                        placeholder={LOGIN_UI.PASSWORD_PLACEHOLDER}
                        icon={FiLock}
                        error={errors.password}
                        disabled={loading}
                        autoComplete="current-password"
                        required
                    />

                    {/* Remember me & Forgot password */}
                    <div className="auth-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                            />
                            <span>{LOGIN_UI.REMEMBER_ME}</span>
                        </label>

                        <Link to="/forgot-password" className="forgot-link">
                            {LOGIN_UI.FORGOT_PASSWORD}
                        </Link>
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        disabled={loading}
                    >
                        {loading ? LOGIN_UI.SUBMITTING_BTN : LOGIN_UI.SUBMIT_BTN}
                    </Button>
                </form>

                {/* Footer - Sign up link */}
                <div className="auth-footer">
                    <span>{LOGIN_UI.SIGNUP_LINK}</span>
                    <Link to="/signup" className="auth-link">
                        {LOGIN_UI.SIGNUP_LINK_TEXT}
                    </Link>
                </div>
            </div>
        </div>
    );
}

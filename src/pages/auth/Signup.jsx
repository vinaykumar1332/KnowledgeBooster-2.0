// pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import ToastNotification from "../../components/toast/ToastNotification";
import { API_CONFIG } from "../../config/Api.config";
import "./login.css";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        userType: null,
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [touched, setTouched] = useState({}); // Track which fields user touched

    const userTypes = [
        { label: "Student", value: "student" },
        { label: "Professional", value: "professional" },
        { label: "Others", value: "others" },
    ];

    const passwordRules = [
        { test: form.password.length >= 8, text: "At least 8 characters" },
        { test: (form.password.match(/[A-Z]/g) || []).length >= 2, text: "2 uppercase letters" },
        { test: (form.password.match(/\d/g) || []).length >= 2, text: "2 numbers" },
        { test: /[!@#$%^&*]/.test(form.password), text: "1 special character (!@#$%^&*)" },
    ];

    const allValid = passwordRules.every((rule) => rule.test);
    const hasPasswordInput = form.password.length > 0;
    const showPasswordRules = hasPasswordInput && !allValid; // Only show when typing & invalid

    const isFormValid =
        form.username.trim() &&
        form.email.trim().includes("@") &&
        form.userType &&
        allValid;

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            showToast("Please fix the errors above");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(API_CONFIG.PROXY_URL, {
                method: "POST",
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    script: "AUTH",
                    action: "signup",
                    username: form.username.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    userType: form.userType,
                }),
            });

            const data = await res.json();

            if (!data.ok) {
                showToast(data.msg || data.message || "Signup failed");
                return;
            }

            showToast("Account created successfully!", "success");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            console.error("Signup error:", err);
            showToast("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="auth-page">
                <div className="auth-card">
                    <h1>
                        Create Account
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Join us today — it's free and quick!
                    </p>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Full Name */}
                        <div className="field">
                            <label> Full Name</label>
                            <InputText
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                onBlur={() => setTouched({ ...touched, username: true })}
                                placeholder="John Doe"
                                className={`w-full ${touched.username && !form.username.trim() ? "p-invalid" : ""}`}
                                required
                            />
                            {touched.username && !form.username.trim() && (
                                <small className="p-error">Name is required</small>
                            )}
                        </div>

                        {/* Email */}
                        <div className="field">
                            <label> Email Address</label>
                            <InputText
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onBlur={() => setTouched({ ...touched, email: true })}
                                placeholder="you@example.com"
                                className={`w-full ${touched.email && !form.email.includes("@") ? "p-invalid" : ""}`}
                                required
                            />
                            {touched.email && !form.email.includes("@") && (
                                <small className="p-error">Valid email required</small>
                            )}
                        </div>

                        {/* Password */}
                        <div className="field">
                            <label> Password</label>
                            <Password
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onFocus={() => setTouched({ ...touched, password: true })}
                                feedback={false}
                                toggleMask
                                placeholder="Create a strong password"
                                className="w-full"
                            />

                            {/* Show rules only when user types password & it's invalid */}
                            <div className={`password-rules mt-3 transition-all duration-300 ${showPasswordRules ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}>
                                {passwordRules.map((rule, i) => (
                                    <div
                                        key={i}
                                        className={`rule text-sm flex items-center gap-2 ${rule.test ? "text-green-600" : "text-red-500"}`}
                                    >
                                        <i className={`pi text-xs ${rule.test ? "pi-check-circle" : "pi-times-circle"}`} />
                                        {rule.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Type Dropdown - Fixed: no layout shift */}
                        <div className="field">
                            <label> I am a</label>
                            <Dropdown
                                value={form.userType}
                                options={userTypes}
                                onChange={(e) => setForm({ ...form, userType: e.value })}
                                placeholder="Select your role"
                                className="w-full"
                                panelClassName="z-50" // Ensures dropdown floats above everything
                                required
                            />
                        </div>

                        {/* Submit Button - Clean & Consistent */}
                        <div className="drop-down-sign-up">
                            <button
                                type="submit"
                                className="btn-primary btn"
                                disabled={loading || !isFormValid}
                            >
                                <span className="btn-text">
                                    {loading ? "Creating Account..." : "Create Account"}
                                </span>
                            </button>
                        </div>
                    </form>

                    <p className="auth-foot mt-6">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
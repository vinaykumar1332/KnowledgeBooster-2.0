// pages/Signup.jsx
import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import ToastNotification from "../../components/toast/ToastNotification";
import API_CONFIG from "../../config/Api.config"; // ← Uses your config
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

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!form.username || !form.email || !form.password || !form.userType) {
            return showToast("Please fill all fields");
        }

        if (!allValid) {
            return showToast("Password does not meet requirements");
        }

        setLoading(true);

        try {
            const res = await fetch(API_CONFIG.PROXY_URL, {
                method: "POST",
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    script: "AUTH",           // ← Important: tells proxy which script
                    action: "signup",         // ← Your Apps Script action
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
            showToast("Connection failed. Check internet or try again.");
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
                        <i className="pi pi-user-plus mr-2" />
                        Create Account
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Join us today — it's free and quick!
                    </p>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="field">
                            <label>
                                <i className="pi pi-user mr-2" />
                                Full Name
                            </label>
                            <InputText
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="John Doe"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-envelope mr-2" />
                                Email Address
                            </label>
                            <InputText
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-lock mr-2" />
                                Password
                            </label>
                            <Password
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                feedback={false}
                                toggleMask
                                placeholder="Create a strong password"
                                className="w-full"
                            />

                            <div className="password-rules mt-3">
                                {passwordRules.map((rule, i) => (
                                    <div
                                        key={i}
                                        className={`rule text-sm flex items-center gap-2 ${rule.test ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        <i className={`pi text-xs ${rule.test ? "pi-check-circle" : "pi-times-circle"}`} />
                                        {rule.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-users mr-2" />
                                I am a
                            </label>
                            <Dropdown
                                value={form.userType}
                                options={userTypes}
                                onChange={(e) => setForm({ ...form, userType: e.value })}
                                placeholder="Select your role"
                                className="w-full"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-btn primary w-full mt-6"
                            disabled={loading || !allValid}
                        >
                            {loading ? (
                                <>
                                    <i className="pi pi-spin pi-spinner mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="pi pi-check mr-2" />
                                    Create Account
                                </>
                            )}
                        </button>
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
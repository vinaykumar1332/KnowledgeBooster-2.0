// pages/Signup.jsx
import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import ToastNotification from "../../components/toast/ToastNotification";
import "./login.css";

export default function Signup() {
    const API_URL = "/api/appProxy";

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        userType: null,
    });

    const [toast, setToast] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

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

    const allValid = passwordRules.every(rule => rule.test);

    const showToast = (msg, type = "error") => {
        setToast({ message: msg, type });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!allValid) {
            showToast("Please fix password requirements");
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "signup", ...form }),
            });

            const data = await res.json();

            if (!data.ok) {
                showToast(data.msg || "Signup failed");
                return;
            }

            showToast("Account created successfully!", "success");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err) {
            showToast("Network error. Try again.");
        }
    };

    return (
        <>
            {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="auth-page">
                <div className="auth-card">
                    <h1>
                        <i className="pi pi-user-plus mr-2" />
                        Create Account
                    </h1>

                    <form onSubmit={handleSignup}>
                        <div className="field">
                            <label>
                                <i className="pi pi-user mr-2" />
                                Full Name
                            </label>
                            <InputText
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                placeholder="John Doe"
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
                                required
                            />
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-lock mr-2" />
                                Password
                            </label>
                            <div className="p-inputgroup">
                                <Password
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    feedback={false}
                                    toggleMask
                                    inputClassName="w-full"
                                    className="w-full"
                                />
                            </div>

                            <div className="password-rules">
                                {passwordRules.map((rule, i) => (
                                    <div key={i} className={`rule ${rule.test ? "valid" : "invalid"}`}>
                                        <i className={`pi ${rule.test ? "pi-check" : "pi-times"}`} />
                                        {rule.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label>
                                <i className="pi pi-users mr-2" />
                                User Type
                            </label>
                            <Dropdown
                                value={form.userType}
                                options={userTypes}
                                onChange={(e) => setForm({ ...form, userType: e.value })}
                                placeholder="Select your role"
                                className="w-full"
                            />
                        </div>

                        <button type="submit" className="auth-btn primary w-full">
                            <i className="pi pi-check mr-2" />
                            Create Account
                        </button>

                        <p className="auth-foot">
                            Already have an account? <a href="/login">Login here</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
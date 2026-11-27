// src/pages/auth/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/shared/Select";
import AuthLayout from "./AuthLayout";
import { signup } from "../../services/authService";
import { useToast } from "../../hooks/useToast";
import { UI_CONFIG } from "../../config/ui.config";
import { cn } from "@/lib/utils";

const T = UI_CONFIG.AUTH.SIGNUP;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_TYPES = [
    { value: "student", label: "Student" },
    { value: "professional", label: "Professional" },
    { value: "others", label: "Others" },
];

const EMPTY = { username: "", email: "", password: "", confirmPassword: "", userType: "" };

/** Each rule is checked live while the user types. */
const passwordRules = (pw) => [
    { id: "length", text: "At least 8 characters", met: pw.length >= 8 },
    { id: "upper", text: "2 uppercase letters", met: (pw.match(/[A-Z]/g) || []).length >= 2 },
    { id: "digits", text: "2 numbers", met: (pw.match(/\d/g) || []).length >= 2 },
    { id: "special", text: "1 special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(pw) },
];

export default function Signup() {
    const navigate = useNavigate();
    const toast = useToast();
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const rules = useMemo(() => passwordRules(form.password), [form.password]);
    const passwordValid = rules.every((r) => r.met);

    const set = (key) => (e) => {
        const value = e && e.target ? e.target.value : e;
        setForm((f) => ({ ...f, [key]: value }));
        if (errors[key]) setErrors((s) => ({ ...s, [key]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!form.username.trim()) next.username = T.ERROR_USERNAME_REQUIRED;
        if (!form.email.trim()) next.email = T.ERROR_EMAIL_REQUIRED;
        else if (!EMAIL_RE.test(form.email.trim())) next.email = UI_CONFIG.AUTH.LOGIN.ERROR_INVALID_EMAIL;
        if (!passwordValid) next.password = T.ERROR_WEAK_PASSWORD;
        if (form.confirmPassword !== form.password) next.confirmPassword = T.ERROR_PASSWORD_MISMATCH;
        if (!form.userType) next.userType = T.USER_TYPE_REQUIRED;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const res = await signup({
            username: form.username.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            confirmPassword: form.confirmPassword,
            userType: form.userType,
        });
        setLoading(false);

        if (!res.ok) {
            toast.error(res.msg || T.ERROR_GENERIC);
            return;
        }
        toast.success(T.SUCCESS_MESSAGE);
        navigate("/login", { replace: true });
    };

    return (
        <AuthLayout
            title={T.TITLE}
            subtitle={T.SUBTITLE}
            footer={
                <>
                    {T.LOGIN_LINK}{" "}
                    <Link to="/login" className="font-semibold text-foreground underline underline-offset-4">
                        {T.LOGIN_LINK_TEXT}
                    </Link>
                </>
            }
        >
            <form className="grid gap-5" onSubmit={handleSubmit} noValidate>

                <Input
                    name="username"
                    label={T.USERNAME_LABEL}
                    placeholder={T.USERNAME_PLACEHOLDER}
                    autoComplete="name"
                    value={form.username}
                    onChange={set("username")}
                    error={errors.username}
                    disabled={loading}
                    required
                />

                <Input
                    name="email"
                    type="email"
                    label={T.EMAIL_LABEL}
                    placeholder={T.EMAIL_PLACEHOLDER}
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                    disabled={loading}
                    required
                />

                <Select
                    name="userType"
                    label={T.USER_TYPE_LABEL}
                    placeholder={T.USER_TYPE_PLACEHOLDER}
                    options={USER_TYPES}
                    value={form.userType}
                    onChange={set("userType")}
                    error={errors.userType}
                    disabled={loading}
                    required
                />

                <div className="grid gap-3">
                    <Input
                        name="password"
                        type="password"
                        label={T.PASSWORD_LABEL}
                        placeholder={T.PASSWORD_PLACEHOLDER}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={set("password")}
                        error={errors.password}
                        disabled={loading}
                        required
                    />

                    {form.password && (
                        <ul aria-label="Password requirements" className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                            {rules.map((r) => (
                                <li
                                    key={r.id}
                                    className={cn(
                                        "flex items-center gap-2 transition-colors duration-200",
                                        r.met ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            "size-1.5 rounded-full transition-colors duration-200",
                                            r.met ? "bg-foreground" : "bg-muted-foreground/40"
                                        )}
                                    />
                                    {r.text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <Input
                    name="confirmPassword"
                    type="password"
                    label={T.CONFIRM_PASSWORD_LABEL}
                    placeholder={T.CONFIRM_PASSWORD_PLACEHOLDER}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    error={errors.confirmPassword}
                    disabled={loading}
                    required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading}>
                    {loading ? T.SUBMITTING_BTN : T.SUBMIT_BTN}
                </Button>
            </form>
        </AuthLayout>
    );
}


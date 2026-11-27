// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import AuthLayout from "./AuthLayout";
import { login } from "../../services/authService";
import { useToast } from "../../hooks/useToast";
import { UI_CONFIG } from "../../config/ui.config";

const T = UI_CONFIG.AUTH.LOGIN;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REMEMBER_KEY = "rememberedEmail";

export default function Login() {
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState(() => localStorage.getItem(REMEMBER_KEY) || "");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(() => !!localStorage.getItem(REMEMBER_KEY));
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const next = {};
        if (!email.trim()) next.email = T.ERROR_EMAIL_REQUIRED;
        else if (!EMAIL_RE.test(email.trim())) next.email = T.ERROR_INVALID_EMAIL;
        if (!password) next.password = T.ERROR_PASSWORD_REQUIRED;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const res = await login({ email, password });
        setLoading(false);

        if (!res.ok) {
            toast.error(res.msg || T.ERROR_INVALID_CREDENTIALS);
            return;
        }

        sessionStorage.setItem(
            "auth",
            JSON.stringify({ ok: true, token: res.token, username: res.username, email: res.email, userType: res.userType })
        );
        if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
        else localStorage.removeItem(REMEMBER_KEY);

        window.dispatchEvent(new Event("authChange"));
        toast.success(T.SUCCESS_MESSAGE);
        navigate("/home", { replace: true });
    };

    return (
        <AuthLayout
            title={T.TITLE}
            subtitle={T.SUBTITLE}
            footer={
                <>
                    {T.SIGNUP_LINK}{" "}
                    <Link to="/signup" className="font-semibold text-foreground underline underline-offset-4">
                        {T.SIGNUP_LINK_TEXT}
                    </Link>
                </>
            }
        >
            <form className="grid gap-5" onSubmit={handleSubmit} noValidate>

                <Input
                    name="email"
                    type="email"
                    label={T.EMAIL_LABEL}
                    placeholder={T.EMAIL_PLACEHOLDER}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((s) => ({ ...s, email: "" }));
                    }}
                    error={errors.email}
                    disabled={loading}
                    required
                />

                <Input
                    name="password"
                    type="password"
                    label={T.PASSWORD_LABEL}
                    placeholder={T.PASSWORD_PLACEHOLDER}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((s) => ({ ...s, password: "" }));
                    }}
                    error={errors.password}
                    disabled={loading}
                    required
                />

                <label className="flex cursor-pointer items-center gap-2.5 text-sm select-none">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={loading}
                        className="size-4 accent-foreground"
                    />
                    <span>{T.REMEMBER_ME}</span>
                </label>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={loading}>
                    {loading ? T.SUBMITTING_BTN : T.SUBMIT_BTN}
                </Button>
            </form>
        </AuthLayout>
    );
}


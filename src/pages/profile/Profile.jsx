// src/pages/profile/Profile.jsx
import React, { useEffect, useState } from "react";
import "../files/FilesPage.css";

export default function Profile() {
    const [user, setUser] = useState({ username: "", email: "" });

    useEffect(() => {
        try {
            const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
            if (auth?.ok) setUser({ username: auth.username || "", email: auth.email || "" });
        } catch (_) { }
    }, []);

    // Profile shows only user details; no file list

    return (
        <div className="files-page bw-theme">
            <header className="files-header">
                <h2>Profile</h2>
                <div className="kh-profile-card" style={{ border: '1px solid var(--kh-border)', padding: 12, borderRadius: 'var(--kh-radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="kh-avatar small">{(user.username || 'U').slice(0, 1).toUpperCase()}</div>
                    <div>
                        <div className="kh-profile-name" style={{ fontWeight: 600 }}>{user.username}</div>
                        <div className="kh-profile-email" style={{ color: 'var(--kh-text-muted)' }}>{user.email}</div>
                    </div>
                </div>
            </header>

            {/* No uploads list on Profile page */}
        </div>
    );
}

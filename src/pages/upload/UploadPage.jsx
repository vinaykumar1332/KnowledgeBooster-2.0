// src/pages/upload/UploadPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveFileMetadata } from "../../services/filesService";
import { extractDriveFileId, buildDrivePreviewUrl } from "../../utils/drive";
import "./UploadPage.css";

const categories = {
    student: ["Notes", "Assignments", "Projects"],
    professional: ["Reports", "Whitepapers", "Case Studies"],
    others: ["Misc"],
};

export default function UploadPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ username: "", email: "" });
    const [form, setForm] = useState({
        category: "student",
        subcategory: "Notes",
        title: "",
        description: "",
        driveUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    // Load user
    useEffect(() => {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        if (stored?.ok) {
            setUser({
                username: stored.username || "",
                email: stored.email || "",
            });
        }
    }, []);

    // Auto update subcategory when category changes
    useEffect(() => {
        setForm((f) => ({
            ...f,
            subcategory: categories[f.category][0] || "",
        }));
    }, [form.category]);

    const handleChange = (key, value) =>
        setForm((f) => ({ ...f, [key]: value }));

    // 🔍 Drive validation + preview
    const fileId = useMemo(
        () => extractDriveFileId(form.driveUrl),
        [form.driveUrl]
    );

    const isDriveValid = Boolean(fileId);
    const previewUrl = isDriveValid ? buildDrivePreviewUrl(fileId) : null;

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        if (!form.title || !form.driveUrl) {
            setMsg({ type: "error", text: "Title and Drive link are required" });
            return;
        }

        if (!isDriveValid) {
            setMsg({ type: "error", text: "Invalid Google Drive link" });
            return;
        }

        setLoading(true);

        const payload = {
            username: user.username,
            email: user.email,
            category: form.category,
            subcategory: form.subcategory,
            title: form.title,
            description: form.description,
            driveUrl: form.driveUrl,
            fileId,
            thumbnailUrl: "",
        };

        try {
            const resp = await saveFileMetadata(payload);
            if (resp.ok) {
                setMsg({ type: "success", text: "Saved — redirecting…" });
                setTimeout(() => navigate("/files"), 700);
            } else {
                setMsg({ type: "error", text: resp.msg || resp.error || "Save failed" });
            }
        } catch {
            setMsg({ type: "error", text: "Connection failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page bw-theme">
            <div className="upload-card">
                <h2>Upload file</h2>

                <form onSubmit={handleSubmit} className="upload-form">
                    <label>Your name</label>
                    <input value={user.username} readOnly />

                    <label>Your email</label>
                    <input value={user.email} readOnly />

                    <label>Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="professional">Working Professional</option>
                        <option value="others">Others</option>
                    </select>

                    <label>Subcategory</label>
                    <select
                        value={form.subcategory}
                        onChange={(e) => handleChange("subcategory", e.target.value)}
                    >
                        {categories[form.category].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <label>Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />

                    <label>Google Drive share link</label>
                    <input
                        value={form.driveUrl}
                        onChange={(e) => handleChange("driveUrl", e.target.value)}
                        placeholder="https://drive.google.com/file/d/FILE_ID/view"
                        className={form.driveUrl && !isDriveValid ? "input-error" : ""}
                        required
                    />

                    {/* 🔍 LIVE PREVIEW */}
                    {form.driveUrl && (
                        <div className="upload-preview">
                            {isDriveValid ? (
                                <iframe
                                    src={previewUrl}
                                    title="Drive preview"
                                    frameBorder="0"
                                />
                            ) : (
                                <div className="preview-error">
                                    Invalid Google Drive link
                                </div>
                            )}
                        </div>
                    )}

                    <div className="submit-row">
                        <button
                            type="submit"
                            className="btn"
                            disabled={loading || !isDriveValid}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="btn alt"
                            onClick={() => navigate("/files")}
                        >
                            Cancel
                        </button>
                    </div>

                    {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
                </form>
            </div>
        </div>
    );
}

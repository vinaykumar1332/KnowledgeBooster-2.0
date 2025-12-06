// src/pages/upload/UploadPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveFileMetadata } from "../../services/filesService";
import { extractDriveFileId } from "../../utils/drive";
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

    useEffect(() => {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        if (stored?.ok) setUser({ username: stored.username || "", email: stored.email || "" });
    }, []);

    useEffect(() => {
        setForm((f) => ({ ...f, subcategory: categories[f.category][0] || "" }));
    }, [form.category]);

    const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        if (!form.title || !form.driveUrl) {
            setMsg({ type: "error", text: "Title and Drive link required" });
            return;
        }

        setLoading(true);
        const fileId = extractDriveFileId(form.driveUrl);
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
                setMsg({ type: "success", text: "Saved — redirecting to files..." });
                setTimeout(() => navigate("/files"), 700);
            } else {
                setMsg({ type: "error", text: resp.msg || resp.error || "Save failed" });
                console.error("saveFileMetadata response:", resp);
            }
        } catch (err) {
            console.error("saveFileMetadata error:", err);
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
                    <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
                        <option value="student">Student</option>
                        <option value="professional">Working Professional</option>
                        <option value="others">Others</option>
                    </select>

                    <label>Subcategory</label>
                    <select value={form.subcategory} onChange={(e) => handleChange("subcategory", e.target.value)}>
                        {(categories[form.category] || []).map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <label>Title</label>
                    <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} required />

                    <label>Description</label>
                    <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} />

                    <label>Google Drive share link (Anyone with link can view)</label>
                    <input
                        value={form.driveUrl}
                        onChange={(e) => handleChange("driveUrl", e.target.value)}
                        placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                        required
                    />

                    <div className="submit-row">
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button type="button" className="btn alt" onClick={() => navigate("/files")}>
                            Cancel
                        </button>
                    </div>
                    {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
                </form>
            </div>
        </div>
    );
}

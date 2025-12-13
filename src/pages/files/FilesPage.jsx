// src/pages/files/FilesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchFiles } from "../../services/filesService";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import ToastNotification from "../../components/toast/ToastNotification";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import "./FilesPage.css";

export default function FilesPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const res = await fetchFiles();
            if (res.ok && Array.isArray(res.rows)) {
                setFiles(res.rows.reverse());
                setToast({
                    type: "success",
                    message: "Files loaded successfully. Happy learning 📚",
                });
            }
        } catch {
            setToast({ type: "error", message: "Failed to load files" });
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        if (!query) return files;
        const q = query.toLowerCase();
        return files.filter((f) =>
            [f.title, f.description, f.category, f.subcategory, f.username]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [files, query]);

    return (
        <div className="files-page bw-theme">
            <header className="files-header">
                <h2>Files</h2>

                <InputText
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="files-search"
                />

                <div className="files-count">
                    {filtered.length} / {files.length}
                </div>
            </header>

            {loading ? (
                <div className="files-loading">
                    <ProgressSpinner />
                    <span>Please wait…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="no-files">No files found</div>
            ) : (
                <div className="files-grid">
                    {filtered.map((row, i) => (
                        <FileCard
                            key={i}
                            item={row}
                            onOpen={(fileId, title) =>
                                setPreview({ fileId, title })
                            }
                        />
                    ))}
                </div>
            )}

            <a href="/upload" className="upload-fab">
                ⬆ Upload
            </a>

            {preview && (
                <FilePreviewModal
                    fileId={preview.fileId}
                    title={preview.title}
                    onClose={() => setPreview(null)}
                />
            )}

            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

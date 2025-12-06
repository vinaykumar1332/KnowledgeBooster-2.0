// src/pages/files/FilesPage.jsx
import React, { useEffect, useState } from "react";
import { fetchFiles } from "../../services/filesService";
import FileCard from "../../components/cards/FileCard";
import "./FilesPage.css";

export default function FilesPage() {
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);
        try {
            const data = await fetchFiles();
            if (data.ok && Array.isArray(data.rows)) {
                setFiles(data.rows.reverse());
            } else if (data.ok && Array.isArray(data)) {
                // some scripts return raw array
                setFiles(data.reverse());
            } else {
                console.warn("fetchFiles returned:", data);
                setFiles([]);
            }
        } catch (err) {
            console.error("fetchFiles error:", err);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="files-loading">Loading...</div>;

    return (
        <div className="files-page bw-theme">
            <div className="files-header">
                <h2>Files</h2>
                <button className="btn btn-primary">
                    <a href="/upload" className="btn-text">
                        Upload file
                    </a>
                </button>

            </div>

            {!files || files.length === 0 ? (
                <div className="no-files">
                    <div className="no-files-card">
                        <h3>No files yet</h3>
                        <p>Be the first to upload a document.</p>
                        <a href="/upload" className="btn">
                            Upload
                        </a>
                    </div>
                </div>
            ) : (
                <div className="files-grid">{files.map((row, i) => <FileCard key={i} item={row} />)}</div>
            )}
        </div>
    );
}

import React from "react";
import { buildDrivePreviewUrl } from "../../utils/drive";
import "./FileCard.css";

export default function FileCard({ item }) {
    // item fields expected from Apps Script: timestamp, username, email, category, subcategory, title, description, driveUrl, fileId, thumbnailUrl
    const fileId = item.fileId || (item.driveUrl ? (item.driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || [])[1] : null);
    const previewUrl = fileId ? buildDrivePreviewUrl(fileId) : null;
    const thumb = item.thumbnailUrl;

    return (
        <div className="file-card bw-theme">
            <div className="thumb">
                {thumb ? (
                    <img src={thumb} alt={item.title} />
                ) : previewUrl ? (
                    <iframe title={item.title} src={previewUrl} frameBorder="0" />
                ) : (
                    <div className="placeholder">No preview</div>
                )}
            </div>

            <div className="meta">
                <h3 className="title">{item.title}</h3>
                <p className="desc">{item.description}</p>
                <div className="meta-row">
                    <span className="cat">{item.category}{item.subcategory ? ` · ${item.subcategory}` : ""}</span>
                    <span className="user">{item.username}</span>
                </div>
                <div className="actions">
                    {previewUrl && <a href={previewUrl} target="_blank" rel="noreferrer" className="link">Open</a>}
                    {item.driveUrl && <a href={item.driveUrl} target="_blank" rel="noreferrer" className="link">Drive</a>}
                </div>
            </div>
        </div>
    );
}

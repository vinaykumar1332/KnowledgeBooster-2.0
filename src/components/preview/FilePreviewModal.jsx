// src/components/preview/FilePreviewModal.jsx
import React from "react";
import PropTypes from "prop-types";
import { buildDrivePreviewUrl } from "../../utils/drive";
import "./FilePreviewModal.css";

export default function FilePreviewModal({ fileId, title, onClose }) {
    return (
        <div className="preview-overlay">
            <div className="preview-header">
                <span>{title}</span>
                <button onClick={onClose}>✕</button>
            </div>

            <iframe
                src={buildDrivePreviewUrl(fileId)}
                title={title}
                frameBorder="0"
            />
        </div>
    );
}

FilePreviewModal.propTypes = {
    fileId: PropTypes.string.isRequired,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

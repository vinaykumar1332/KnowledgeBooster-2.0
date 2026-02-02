// src/components/preview/FilePreviewModal.jsx
import React from "react";
import PropTypes from "prop-types";
import { buildDrivePreviewUrl, buildDriveViewerUrl } from "../../utils/drive";
import { FiExternalLink } from "react-icons/fi";
import "./FilePreviewModal.css";

export default function FilePreviewModal({ fileId, title, onClose }) {
    const previewUrl = buildDrivePreviewUrl(fileId);
    const viewerUrl = buildDriveViewerUrl(fileId);

    return (
        <div className="preview-overlay">
            <div className="preview-header">
                <span>{title}</span>
                <div className="preview-header-actions">
                    {viewerUrl && (
                        <button
                            type="button"
                            className="preview-open-full"
                            onClick={() => window.open(viewerUrl, "_blank", "noopener")}
                        >
                            <FiExternalLink />
                            <span>Open full</span>
                        </button>
                    )}
                    <button type="button" onClick={onClose} aria-label="Close preview">
                        ✕
                    </button>
                </div>
            </div>

            <iframe
                src={previewUrl}
                title={title}
                frameBorder="0"
                className="preview-frame"
            />
        </div>
    );
}

FilePreviewModal.propTypes = {
    fileId: PropTypes.string.isRequired,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

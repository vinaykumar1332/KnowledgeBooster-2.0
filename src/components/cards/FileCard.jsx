// src/components/cards/FileCard.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { extractFileId, buildDrivePreviewUrl, buildDriveViewerUrl } from "../../utils/drive";
import { FiExternalLink } from "react-icons/fi";
import "./FileCard.css";

export default function FileCard({ item, onOpen }) {
    const fileId = extractFileId(item);
    const [showPreview, setShowPreview] = useState(false);
    const [previewFailed, setPreviewFailed] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        let hovered = false;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    setTimeout(() => setShowPreview(true), 150);
                }
            });
        }, { rootMargin: "200px" });
        obs.observe(el);
        const onEnter = () => {
            hovered = true; setShowPreview(true);
        };
        el.addEventListener("mouseenter", onEnter);
        return () => { obs.disconnect(); el.removeEventListener("mouseenter", onEnter); };
    }, []);

    useEffect(() => {
        setPreviewFailed(false);
        setIframeLoaded(false);
    }, [fileId]);

    const previewUrl = buildDrivePreviewUrl(fileId);
    const viewerUrl = buildDriveViewerUrl(fileId);

    return (
        <div
            className={`file-card ${previewFailed ? "file-card--locked" : ""}`}
            onClick={() => onOpen(fileId, item.title)}
            ref={cardRef}
        >
            <div className="thumb">
                {showPreview && !previewFailed && previewUrl ? (
                    <iframe
                        src={previewUrl}
                        title={item.title}
                        frameBorder="0"
                        className="thumb-iframe"
                        onLoad={() => setIframeLoaded(true)}
                        onError={() => setPreviewFailed(true)}
                        style={{ opacity: iframeLoaded ? 1 : 0 }}
                    />
                ) : (
                    <div className="skeleton-box" />
                )}
                {previewFailed && (
                    <div className="thumb-overlay">
                        <div>
                            <p>Access restricted</p>
                            <small>This file cannot be previewed.</small>
                        </div>
                        {viewerUrl && (
                            <button
                                type="button"
                                className="thumb-open-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(viewerUrl, "_blank", "noopener");
                                }}
                            >
                                <FiExternalLink />
                                Open full
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="meta">
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="meta-row">
                    <span>
                        {item.category}
                        {item.subcategory && ` · ${item.subcategory}`}
                    </span>
                    <span>{item.username}</span>
                </div>
            </div>
        </div>
    );
}

FileCard.propTypes = {
    item: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired,
};

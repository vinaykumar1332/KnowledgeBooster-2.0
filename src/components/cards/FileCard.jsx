// src/components/cards/FileCard.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { extractFileId, buildDrivePreviewUrl } from "../../utils/drive";
import "./FileCard.css";

export default function FileCard({ item, onOpen }) {
    const fileId = extractFileId(item);
    const [showPreview, setShowPreview] = useState(false);
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

    return (
        <div
            className="file-card"
            onClick={() => onOpen(fileId, item.title)}
            ref={cardRef}
        >
            <div className="thumb">
                {showPreview ? (
                    <iframe
                        src={buildDrivePreviewUrl(fileId)}
                        title={item.title}
                        frameBorder="0"
                    />
                ) : (
                    <div className="skeleton-box" />
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

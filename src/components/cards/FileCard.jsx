// src/components/cards/FileCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { extractFileId, buildDrivePreviewUrl } from "../../utils/drive";
import "./FileCard.css";

export default function FileCard({ item, onOpen }) {
    const fileId = extractFileId(item);

    return (
        <div
            className="file-card"
            onClick={() => onOpen(fileId, item.title)}
        >
            <div className="thumb">
                <iframe
                    src={buildDrivePreviewUrl(fileId)}
                    title={item.title}
                    frameBorder="0"
                />
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

// components/ToastNotification.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./ToastNotification.css";

const ToastNotification = ({ message, type = "error", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <i className={`pi ${type === "success" ? "pi-check-circle" : "pi-times-circle"} toast-icon`} />
                <span>{message}</span>
            </div>
            <button onClick={onClose} className="toast-close">
                ×
            </button>
        </div>
    );
};

ToastNotification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "info"]),
    onClose: PropTypes.func.isRequired,
};

export default ToastNotification;
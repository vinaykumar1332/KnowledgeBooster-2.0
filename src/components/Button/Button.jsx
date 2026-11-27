/**
 * Reusable Button Component
 * Configurable, accessible, and styled
 */

import React from 'react';
import './Button.css';

const Button = ({
    // Content
    children,
    label,
    icon: Icon,

    // Styling
    variant = 'primary', // primary, secondary, danger, ghost
    size = 'md', // sm, md, lg
    fullWidth = false,

    // State
    loading = false,
    disabled = false,

    // Interaction
    onClick,
    type = 'button',

    // Accessibility
    title,
    ariaLabel,

    // Additional props
    className = '',
    ...props
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            title={title}
            aria-label={ariaLabel}
            className={`
                btn
                btn-${variant}
                btn-${size}
                ${fullWidth ? 'btn-full-width' : ''}
                ${loading ? 'btn-loading' : ''}
                ${className}
            `.trim()}
            {...props}
        >
            {loading && (
                <span className="btn-spinner" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </span>
            )}

            {Icon && !loading && (
                <Icon className="btn-icon" aria-hidden="true" />
            )}

            <span className="btn-text">
                {children || label || 'Button'}
            </span>
        </button>
    );
};

export default Button;

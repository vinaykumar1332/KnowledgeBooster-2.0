

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    // Display
    message,
    variant = 'spinner', // spinner, dots, bar, skeleton
    size = 'md', // sm, md, lg
    fullScreen = false,

    // Content
    icon: Icon,

    // Styling
    className = '',
    ...props
}) => {
    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                <div className={`loading-spinner loading-${variant} loading-${size}`}>
                    {variant === 'spinner' && <SpinnerAnimation />}
                    {variant === 'dots' && <DotsAnimation />}
                    {variant === 'bar' && <BarAnimation />}

                    {message && <p className="loading-message">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`loading-spinner loading-${variant} loading-${size} ${className}`.trim()}
            role="status"
            aria-live="polite"
            {...props}
        >
            {Icon && <Icon className="loading-icon" />}

            {variant === 'spinner' && <SpinnerAnimation />}
            {variant === 'dots' && <DotsAnimation />}
            {variant === 'bar' && <BarAnimation />}

            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

const SpinnerAnimation = () => (
    <svg
        viewBox="0 0 50 50"
        className="loading-svg"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
            opacity="0.1"
        />
        <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
            strokeDasharray="31.4 94.2"
            strokeLinecap="round"
            className="loading-circle"
        />
    </svg>
);

const DotsAnimation = () => (
    <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
    </div>
);

const BarAnimation = () => (
    <div className="loading-bar">
        <div className="bar-fill"></div>
    </div>
);

/**
 * Skeleton Loading Component
 * Shows placeholder skeleton while loading
 */
export const SkeletonLoader = ({
    count = 1,
    type = 'card', // card, text, line, circle
    height = '100px',
}) => (
    <div className="skeleton-loader">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className={`skeleton-item skeleton-${type}`}
                style={{ height: type === 'text' ? 'auto' : height }}
            >
                {type === 'line' && <div className="skeleton-line"></div>}
                {type === 'text' && (
                    <>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                    </>
                )}
            </div>
        ))}
    </div>
);

export default LoadingSpinner;

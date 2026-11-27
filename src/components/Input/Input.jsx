/**
 * Reusable Input Component
 * Supports text, email, password, and more
 */

import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import './Input.css';

const Input = ({
    // Content
    label,
    placeholder,
    helpText,

    // Type & Validation
    type = 'text',
    name,
    value,

    // State
    error,
    disabled = false,
    required = false,

    // Interaction
    onChange,
    onFocus,
    onBlur,
    onClear,

    // Styling
    variant = 'default', // default, underline, filled
    size = 'md', // sm, md, lg
    icon: Icon,
    clearable = false,

    // Accessibility
    ariaLabel,
    ariaDescribedBy,

    // Additional props
    className = '',
    maxLength,
    pattern,
    autoComplete,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const displayType = isPassword && showPassword ? 'text' : type;

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleClear = () => {
        onClear?.();
    };

    const hasValue = value && value.toString().length > 0;
    const inputId = name || `input-${Math.random()}`;
    const helpId = `${inputId}-help`;

    return (
        <div className={`input-wrapper input-${variant} input-${size} ${className}`.trim()}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className={`input-container ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
                {Icon && (
                    <Icon className="input-icon-left" aria-hidden="true" />
                )}

                <input
                    id={inputId}
                    type={displayType}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    pattern={pattern}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    aria-label={ariaLabel}
                    aria-describedby={error ? helpId : ariaDescribedBy}
                    aria-invalid={!!error}
                    className="input-field"
                    {...props}
                />

                {/* Right icons area */}
                <div className="input-icons-right">
                    {/* Show/Hide password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            className="input-icon-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <FiEyeOff size={18} />
                            ) : (
                                <FiEye size={18} />
                            )}
                        </button>
                    )}

                    {/* Clear button */}
                    {clearable && hasValue && !disabled && (
                        <button
                            type="button"
                            className="input-icon-btn"
                            onClick={handleClear}
                            title="Clear"
                            aria-label="Clear input"
                        >
                            <FiX size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Help text or error */}
            {(error || helpText) && (
                <div
                    id={helpId}
                    className={`input-help ${error ? 'error' : 'help'}`}
                    role={error ? 'alert' : 'status'}
                >
                    {error || helpText}
                </div>
            )}

            {/* Character count */}
            {maxLength && (
                <div className="input-counter">
                    <span>{value?.length || 0}</span>
                    <span>/ {maxLength}</span>
                </div>
            )}
        </div>
    );
};

export default Input;

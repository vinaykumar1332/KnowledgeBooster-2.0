/**
 * Validation Utilities
 * Functions to validate user input and data
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
export const validatePassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validate file metadata
 */
export const validateFileMetadata = ({ title, category, subcategory }) => {
    if (!title || title.trim().length === 0) {
        return { valid: false, error: 'Title is required' };
    }

    if (title.length > 200) {
        return { valid: false, error: 'Title must be less than 200 characters' };
    }

    if (!category || !['student', 'professional', 'others'].includes(category)) {
        return { valid: false, error: 'Invalid category' };
    }

    if (!subcategory || subcategory.trim().length === 0) {
        return { valid: false, error: 'Subcategory is required' };
    }

    return { valid: true };
};

/**
 * Extract Google Drive file ID from various URL formats
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 */
export const extractDriveFileId = (url) => {
    if (!url) return null;

    try {
        // Pattern 1: /file/d/FILE_ID/view
        const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
        if (match1 && match1[1]) return match1[1];

        // Pattern 2: open?id=FILE_ID
        const match2 = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (match2 && match2[1]) return match2[1];

        // Pattern 3: folders or other patterns
        const match3 = url.match(/(?:\/d|id=|\/folders)\/([a-zA-Z0-9-_]+)/);
        if (match3 && match3[1]) return match3[1];

        return null;
    } catch (err) {
        return null;
    }
};

/**
 * Validate Google Drive URL
 */
export const isValidDriveUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return /drive\.google\.com/.test(url) && extractDriveFileId(url) !== null;
};

/**
 * Build Google Drive preview URL
 */
export const buildDrivePreviewUrl = (fileId) => {
    if (!fileId) return null;
    return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Build Google Drive thumbnail URL
 */
export const buildDriveThumbnailUrl = (fileId) => {
    if (!fileId) return null;
    return `https://lh3.google.com/d/${fileId}=w200-h300`;
};

/**
 * Sanitize input string
 * Removes dangerous characters
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .slice(0, 500); // Limit length
};

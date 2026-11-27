/**
 * UI Configuration
 * Centralized configuration for all UI text, labels, and button text
 * Easy to update without touching components
 */

export const UI_CONFIG = {
    // ============================================
    // AUTHENTICATION PAGE
    // ============================================
    AUTH: {
        ASIDE: {
            TITLE: "Learn together. Grow together.",
            POINTS: [
                "Free study notes shared by students",
                "Search every shared PDF in one place",
                "Upload from Google Drive in one step",
            ],
        },
        LOGIN: {
            TITLE: "Welcome Back",
            SUBTITLE: "Sign in to your account",
            EMAIL_LABEL: "Email Address",
            EMAIL_PLACEHOLDER: "your@email.com",
            PASSWORD_LABEL: "Password",
            PASSWORD_PLACEHOLDER: "••••••••",
            REMEMBER_ME: "Remember me",
            FORGOT_PASSWORD: "Forgot password?",
            SUBMIT_BTN: "Sign In",
            SUBMITTING_BTN: "Signing in...",
            SIGNUP_LINK: "Don't have an account?",
            SIGNUP_LINK_TEXT: "Sign up",
            ERROR_INVALID_CREDENTIALS: "Invalid email or password",
            ERROR_EMAIL_REQUIRED: "Email is required",
            ERROR_PASSWORD_REQUIRED: "Password is required",
            ERROR_INVALID_EMAIL: "Please enter a valid email",
            SUCCESS_MESSAGE: "Login successful!",
            LOADING_MESSAGE: "Authenticating...",
        },

        SIGNUP: {
            TITLE: "Create Account",
            SUBTITLE: "Join our knowledge community",
            USERNAME_LABEL: "Full Name",
            USERNAME_PLACEHOLDER: "John Doe",
            EMAIL_LABEL: "Email Address",
            EMAIL_PLACEHOLDER: "your@email.com",
            PASSWORD_LABEL: "Password",
            PASSWORD_PLACEHOLDER: "••••••••",
            CONFIRM_PASSWORD_LABEL: "Confirm Password",
            CONFIRM_PASSWORD_PLACEHOLDER: "••••••••",
            TERMS_LABEL: "I agree to the Terms of Service",
            SUBMIT_BTN: "Create Account",
            SUBMITTING_BTN: "Creating...",
            LOGIN_LINK: "Already have an account?",
            LOGIN_LINK_TEXT: "Sign in",
            ERROR_USERNAME_REQUIRED: "Full name is required",
            ERROR_EMAIL_REQUIRED: "Email is required",
            ERROR_PASSWORD_REQUIRED: "Password is required",
            ERROR_PASSWORD_MISMATCH: "Passwords do not match",
            ERROR_WEAK_PASSWORD: "Password must be at least 6 characters",
            ERROR_TERMS_NOT_ACCEPTED: "Please accept terms",
            USER_TYPE_LABEL: "I am a",
            USER_TYPE_PLACEHOLDER: "Select your role",
            USER_TYPE_REQUIRED: "Choose the option that describes you",
            ERROR_GENERIC: "Signup failed. Please try again.",
            SUCCESS_MESSAGE: "Account created. Log in to continue.",
            PASSWORD_REQUIREMENT: "Min. 6 characters",
        },
    },

    // ============================================
    // UPLOAD PAGE
    // ============================================
    UPLOAD: {
        PAGE_TITLE: "Share a PDF",
        PAGE_SUBTITLE: "Paste a Google Drive link, describe it, and choose who it helps.",
        STEP_LINK: "Google Drive link",
        STEP_DETAILS: "Details",
        STEP_AUDIENCE: "Who is it for?",
        STEP_TOPIC: "Topic",
        LINK_LABEL: "Share link",
        LINK_HELP: "Use Share > Copy link in Google Drive, then paste it here.",
        LINK_OK: "Link looks good",
        LINK_FOLDER: "This is a folder link. Open the file itself and copy its link.",
        LINK_INVALID: "This doesn't look like a Google Drive file link.",
        LINK_HOWTO: "How do I get the link?",
        LINK_STEPS: [
            "Upload your PDF to Google Drive.",
            "Right-click it and choose Share.",
            "Set General access to \"Anyone with the link\".",
            "Click Copy link and paste it above.",
        ],
        PREVIEW_FILE: "Preview file",
        TITLE_REQUIRED: "Add a title",
        TITLE_TOO_SHORT: "Use at least 3 characters",
        AUDIENCE: {
            student: { label: "Students", hint: "Notes, assignments, exam prep" },
            professional: { label: "Professionals", hint: "Interview prep, reports, research" },
            others: { label: "Everyone", hint: "Guides, books and general reading" },
        },
        TOPIC_LABEL: "Topic",
        TOPIC_PLACEHOLDER: "Type or pick a topic",
        TOPIC_HELP: "Pick one below or type your own.",
        TOPIC_NEW: "\"{topic}\" will be added as a new topic",
        TOPIC_REQUIRED: "Choose or type a topic",
        TOPIC_DEFAULTS: {
            student: ["Notes", "Assignments", "Exam Prep", "Question Papers", "Lab Manual", "Projects", "Syllabus", "Tutorial"],
            professional: ["Interview Prep", "Tutorial", "Documentation", "Reports", "Case Studies", "Presentations", "Research", "Certification"],
            others: ["Guides", "Books", "Reference", "General", "Misc"],
        },
        CARD_PREVIEW: "How it will look",
        CARD_PREVIEW_TITLE: "Your title appears here",
        POSTING_AS: "Posting as",
        SUBMIT: "Share file",
        SUBMITTING: "Sharing…",
        CLEAR_FORM: "Clear form",
        FIX_ERRORS: "Please fix the highlighted fields",
        SUCCESS: "Shared! It's now in your uploads.",
        DUPLICATE_FILE: "This file is already in the library. Use a different Drive link.",
        DUPLICATE_TITLE: "A file with this title already exists. Try a more specific title.",
        DUPLICATE_TOAST: "Duplicate detected — this file is already shared.",
        TITLE: "Upload File",
        SUBTITLE: "Share your study materials",
        YOUR_NAME_LABEL: "Your Name",
        YOUR_EMAIL_LABEL: "Your Email",
        CATEGORY_LABEL: "Category",
        CATEGORY_OPTIONS: {
            STUDENT: "📚 Student",
            PROFESSIONAL: "💼 Working Professional",
            OTHERS: "🎯 Others",
        },
        SUBCATEGORY_LABEL: "Subcategory",
        CUSTOM_SUBCATEGORY_PLACEHOLDER: "Enter custom subcategory",
        TITLE_LABEL: "File Title",
        TITLE_PLACEHOLDER: "e.g., React Hooks Overview",
        DESCRIPTION_LABEL: "Description",
        DESCRIPTION_PLACEHOLDER: "Brief description of the file content...",
        DRIVE_LINK_LABEL: "Google Drive Share Link",
        DRIVE_LINK_PLACEHOLDER: "https://drive.google.com/file/d/FILE_ID/view",
        DRIVE_LINK_HELP: "1. Upload PDF to Google Drive",
        DRIVE_LINK_HELP_2: "2. Set sharing to 'Anyone with the link'",
        DRIVE_LINK_HELP_3: "3. Paste the share link here",
        PREVIEW_LABEL: "File Preview",
        PREVIEW_LOADING: "Loading preview...",
        PREVIEW_ERROR: "Invalid Google Drive link",
        UPLOAD_BTN: "Upload",
        UPLOADING_BTN: "Uploading...",
        CANCEL_BTN: "Cancel",
        SAVE_BTN: "Save",
        SAVING_BTN: "Saving...",
        ERROR_TITLE_REQUIRED: "Title is required",
        ERROR_DRIVE_LINK_REQUIRED: "Google Drive link is required",
        ERROR_INVALID_DRIVE_LINK: "Invalid Google Drive link",
        ERROR_UPLOAD_FAILED: "Upload failed. Please try again.",
        SUCCESS_MESSAGE: "File uploaded successfully!",
    },

    // ============================================
    // FILES/BROWSE PAGE
    // ============================================
    FILES: {
        TITLE: "Browse Files",
        SUBTITLE: "Study notes and PDFs shared by the community",
        MINE_TITLE: "My Uploads",
        MINE_SUBTITLE: "Everything you have shared",
        MINE_EMPTY_TITLE: "No uploads yet",
        MINE_EMPTY_TEXT: "Share your first PDF and it will show up here.",
        UPLOAD_CTA: "Upload a PDF",
        COUNT: "{shown} of {total} files",
        ALL_CATEGORIES: "All",
        TITLE_FILTER: "Title",
        CLEAR_FILTERS: "Clear filters",
        CLEAR_SEARCH: "Clear search",
        SEARCH_SHORTCUT: "Press / to search",
        PREVIEW: "Preview",
        OPEN_IN_DRIVE: "Open in Drive",
        LOADING_PREVIEW: "Loading preview…",
        CLOSE_PREVIEW: "Close preview",
        SEARCH_PLACEHOLDER: "Search by title, category, or author...",
        FILTER_LABEL: "Filter by Title",
        FILTER_DEFAULT: "All Titles",
        RESULTS_COUNT: "Showing {count} results",
        NO_RESULTS_TITLE: "No files found",
        NO_RESULTS_SUBTITLE: "Try clearing filters or searching a different term",
        UPLOAD_FAB: "Upload",
        LOADING_MESSAGE: "Loading files...",
        ERROR_LOAD_FAILED: "Failed to load files",
        RETRY_BTN: "Retry",
        LOAD_MORE_BTN: "Load More",
        LOADING_MORE: "Loading more files...",
    },

    // ============================================
    // FILE CARD COMPONENT
    // ============================================
    FILE_CARD: {
        OPEN_BTN: "Open",
        DOWNLOAD_BTN: "Download",
        SHARE_BTN: "Share",
        DELETE_BTN: "Delete",
        EDIT_BTN: "Edit",
        BY_TEXT: "by",
        CATEGORY_BADGE: "{category} • {subcategory}",
        CONFIRM_DELETE: "Are you sure? This cannot be undone.",
    },

    // ============================================
    // THEME
    // ============================================
    THEME: {
        DARK: "Switch to dark mode",
        LIGHT: "Switch to light mode",
    },

    // ============================================
    // NAVIGATION
    // ============================================
    NAV: {
        BRAND: "Knowledge Hut 2.0",
        BRAND_MARK: "KH",
        MAIN_LABEL: "Main navigation",
        ACCOUNT_LABEL: "Account menu",
        THEME: "Theme",
        SIGNED_OUT: "You have been signed out",
        COLLAPSE: "Collapse sidebar",
        EXPAND: "Expand sidebar",
        HOME: "Home",
        UPLOAD: "Upload",
        BROWSE: "Browse",
        MY_FILES: "My Files",
        PROFILE: "Profile",
        LOGOUT: "Logout",
        MENU: "Menu",
        CLOSE: "Close",
    },

    // ============================================
    // COMMON BUTTONS
    // ============================================
    BUTTONS: {
        SAVE: "Save",
        SAVING: "Saving...",
        CANCEL: "Cancel",
        DELETE: "Delete",
        DELETING: "Deleting...",
        CONFIRM: "Confirm",
        CLOSE: "Close",
        BACK: "Back",
        NEXT: "Next",
        SUBMIT: "Submit",
        SUBMITTING: "Submitting...",
        LOADING: "Loading...",
        RETRY: "Retry",
        REFRESH: "Refresh",
        OPEN: "Open",
        DOWNLOAD: "Download",
        SHARE: "Share",
        EDIT: "Edit",
        VIEW: "View",
        EXPORT: "Export",
        IMPORT: "Import",
    },

    // ============================================
    // FORM VALIDATION
    // ============================================
    VALIDATION: {
        REQUIRED: "This field is required",
        INVALID_EMAIL: "Please enter a valid email",
        MIN_LENGTH: "Minimum {min} characters required",
        MAX_LENGTH: "Maximum {max} characters allowed",
        PASSWORD_WEAK: "Password must contain uppercase, lowercase, number, and special character",
        FIELD_ERROR: "This field has an error",
    },

    // ============================================
    // STATUS MESSAGES
    // ============================================
    STATUS: {
        SUCCESS: "Success!",
        ERROR: "Error!",
        WARNING: "Warning",
        INFO: "Information",
        LOADING: "Loading...",
        SAVED: "Saved successfully",
        DELETED: "Deleted successfully",
        UPDATED: "Updated successfully",
        COPIED: "Copied to clipboard",
    },

    // ============================================
    // EMPTY STATES
    // ============================================
    EMPTY_STATES: {
        NO_FILES: "No files yet",
        NO_UPLOADS: "You haven't uploaded any files",
        NO_FAVORITES: "No favorites yet",
        NO_RESULTS: "No results found",
        TRY_SEARCHING: "Try searching for something else",
    },

    // ============================================
    // MODALS & DIALOGS
    // ============================================
    MODALS: {
        CONFIRM_DELETE: "Delete File?",
        DELETE_MESSAGE: "This action cannot be undone.",
        CONFIRM_LOGOUT: "Logout?",
        LOGOUT_MESSAGE: "Are you sure you want to logout?",
        CLOSE_BTN: "Close",
        BACK_BTN: "Go Back",
    },

    // ============================================
    // LOADING STATES
    // ============================================
    LOADING: {
        AUTHENTICATION: "Authenticating...",
        UPLOADING: "Uploading file...",
        DOWNLOADING: "Downloading...",
        SEARCHING: "Searching files...",
        SAVING: "Saving changes...",
        DELETING: "Deleting...",
        LOADING: "Loading...",
        PLEASE_WAIT: "Please wait...",
    },

    // ============================================
    // ERROR MESSAGES
    // ============================================
    ERRORS: {
        NETWORK_ERROR: "Network error. Please check your connection.",
        SERVER_ERROR: "Server error. Please try again later.",
        UNAUTHORIZED: "Unauthorized. Please login again.",
        FORBIDDEN: "You don't have permission to access this.",
        NOT_FOUND: "Resource not found.",
        TIMEOUT: "Request timed out. Please try again.",
        GENERIC_ERROR: "Something went wrong. Please try again.",
    },

    // ============================================
    // PROFILE PAGE
    // ============================================
    PROFILE: {
        TITLE: "My Profile",
        ROLE_FALLBACK: "Member",
        STAT_UPLOADS: "Uploads",
        STAT_CATEGORIES: "Categories",
        STAT_TOPICS: "Topics",
        RECENT_TITLE: "Recent uploads",
        VIEW_ALL: "View all",
        EMPTY_TITLE: "No uploads yet",
        EMPTY_TEXT: "Share your first PDF and it will show up here.",
        UPLOAD_CTA: "Upload a PDF",
        LOAD_ERROR: "Could not load your uploads right now.",
        PREFERENCES: "Preferences",
        THEME_LABEL: "Appearance",
        THEME_HINT: "Switch between light and dark mode",
        ACCOUNT: "Account",
        SIGN_OUT_HINT: "Sign out of this device",
        USERNAME_LABEL: "Full Name",
        EMAIL_LABEL: "Email Address",
        TOTAL_UPLOADS: "Total Uploads",
        EDIT_BTN: "Edit Profile",
        CHANGE_PASSWORD_BTN: "Change Password",
        LOGOUT_BTN: "Logout",
        DELETE_ACCOUNT_BTN: "Delete Account",
        JOINED: "Joined on {date}",
    },

    // ============================================
    // LANDING PAGE
    // ============================================
    LANDING: {
        HERO_TITLE: "Welcome to KnowledgeHub",
        HERO_SUBTITLE: "A friendly place to collect study materials, share notes, and revisit ideas.",
        GET_STARTED_BTN: "Get Started",
        UPLOAD_BTN: "Upload a PDF",
        BROWSE_BTN: "Browse Files",
        HOW_IT_WORKS: "How KnowledgeHub Works",
        STEP_1_TITLE: "1. Prepare your PDF",
        STEP_1_DESC: "Collect study notes, docs, or references and export them as a PDF.",
        STEP_2_TITLE: "2. Upload to Google Drive",
        STEP_2_DESC: "Upload the PDF to Google Drive and set sharing to 'Anyone with the link'.",
        STEP_3_TITLE: "3. Share the link here",
        STEP_3_DESC: "Open Upload, paste the share link, add a clear title and category.",
        TIPS_TITLE: "Upload Tips",
        TIP_1: "Use short, descriptive titles (e.g., 'React Hooks Overview').",
        TIP_2: "Pick a category and subcategory so others can find it fast.",
        TIP_3: "Verify your Drive link opens for everyone before submitting.",
        TIP_4: "Keep PDFs under a reasonable size for smooth preview.",
        GUEST_START: "Get started",
        GUEST_LOGIN: "Log in",
        GUEST_SIGNUP: "Sign up",
        HERO_EYEBROW: "Free knowledge library",
        HERO_TITLE_PREFIX: "Welcome to",
        HERO_TITLE_BRAND: "KnowledgeHub",
        STAT_FILES: "Files shared",
        STAT_TITLES: "Topics",
        STAT_CONTRIBUTORS: "Contributors",
        STEPS_TITLE: "How it works",
        FEATURED_OPEN: "Open",
        FEATURED_EMPTY: "No materials yet. Be the first to share one.",
        LOAD_ERROR: "We could not load the library right now. Please try again shortly.",
        CTA_TITLE: "Have notes worth sharing?",
        CTA_SUBTITLE: "Upload a PDF from Google Drive in under a minute and help the next learner.",
        CTA_BTN: "Start sharing",
        FOOTER_NOTE: "Built for learners, free for everyone.",
        LATEST_MATERIALS: "Latest Study Materials",
        CLOSING_TITLE: "Study better, together",
        CLOSING_DESC: "Upload what you learn, and discover what others share. Your knowledge library, always accessible.",
    },
};

/**
 * Helper function to get config value with optional default
 * Usage: getUIText('AUTH.LOGIN.TITLE')
 */
export const getUIText = (path, defaultValue = "") => {
    const keys = path.split('.');
    let value = UI_CONFIG;

    for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return defaultValue;
    }

    return value || defaultValue;
};

/**
 * Helper to interpolate variables in strings
 * Usage: interpolate('Welcome {name}', { name: 'John' })
 */
export const interpolate = (text, variables = {}) => {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
};

export default UI_CONFIG;


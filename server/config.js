// server/config.js — all environment config in one place
export const PORT = process.env.PORT || 3000;
export const AUTH_SOURCE = process.env.AUTH_SOURCE || 'upstream';
export const FILES_SOURCE = process.env.FILES_SOURCE || 'upstream';
export const FRONTEND_URL = process.env.FRONTEND_URL || '';

export const UPSTREAM_FILES_URL =
    process.env.FILES_URL ||
    'https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec';

export const FEATURED_LIMIT = 10;

export const YOUTUBE_API_KEY = process.env.YOU_TUDE_API_KEY || process.env.YOUTUBE_API_KEY || '';

/** Localhost origins accepted in dev (any port). */
export const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

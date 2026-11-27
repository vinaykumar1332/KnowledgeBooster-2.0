/**
 * Files Routes
 * Handles file uploads, retrieval, search, and management
 */

import express from 'express';
import { searchLimiter } from '../middleware/rateLimiter.js';
import { verifyAuth, optionalAuth } from '../middleware/authMiddleware.js';
import {
    getFiles,
    getFileById,
    uploadFile,
    updateFile,
    deleteFile,
    searchFiles,
    getUserFiles,
} from '../controllers/filesController.js';

const router = express.Router();

/**
 * GET /api/files
 * Get all files with pagination and optional filters
 * Query: { offset, limit, category, search }
 */
router.get('/', searchLimiter, optionalAuth, getFiles);

/**
 * GET /api/files/search
 * Search files by keyword
 * Query: { q, limit, offset }
 */
router.get('/search', searchLimiter, searchFiles);

/**
 * GET /api/files/:fileId
 * Get specific file details
 */
router.get('/:fileId', getFileById);

/**
 * POST /api/files/upload
 * Upload new file metadata
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { title, description, category, subcategory, driveUrl }
 */
router.post('/upload', verifyAuth, uploadFile);

/**
 * PUT /api/files/:fileId
 * Update file information
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { title, description, category, subcategory }
 */
router.put('/:fileId', verifyAuth, updateFile);

/**
 * DELETE /api/files/:fileId
 * Delete file (only owner)
 * Headers: { Authorization: "Bearer <token>" }
 */
router.delete('/:fileId', verifyAuth, deleteFile);

/**
 * GET /api/files/user/me
 * Get current user's uploaded files
 * Headers: { Authorization: "Bearer <token>" }
 * Query: { limit, offset }
 */
router.get('/user/me', verifyAuth, getUserFiles);

export default router;

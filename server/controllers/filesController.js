/**
 * Files Controller
 * Handles file operations: upload, retrieve, search, delete, update
 */

import NodeCache from 'node-cache';
import { AppError } from '../middleware/errorHandler.js';
import { validateFileMetadata, extractDriveFileId } from '../utils/validators.js';

// In-memory file storage (replace with database later)
const files = [];
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

let fileIdCounter = 1;

/**
 * GET /api/files
 * Get all files with pagination
 */
export const getFiles = async (req, res, next) => {
    try {
        const { offset = 0, limit = 20, category } = req.query;

        // Check cache first
        const cacheKey = `files_${offset}_${limit}_${category || 'all'}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        let result = files;

        // Filter by category if provided
        if (category && category !== 'all') {
            result = result.filter(f => f.category === category);
        }

        // Sort by created date (newest first)
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const start = parseInt(offset, 10) || 0;
        const pageSize = parseInt(limit, 10) || 20;
        const paginatedFiles = result.slice(start, start + pageSize);

        const response = {
            status: 'success',
            ok: true,
            rows: paginatedFiles,
            total: result.length,
            offset: start,
            limit: pageSize,
            hasMore: start + pageSize < result.length,
        };

        // Cache the result
        cache.set(cacheKey, response);

        res.json(response);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/files/search
 * Search files by keyword
 */
export const searchFiles = async (req, res, next) => {
    try {
        const { q, limit = 20, offset = 0 } = req.query;

        if (!q) {
            return res.json({
                status: 'success',
                rows: [],
                total: 0,
            });
        }

        const query = q.toLowerCase();
        const start = parseInt(offset, 10) || 0;
        const pageSize = parseInt(limit, 10) || 20;

        // Search across title, description, category, subcategory, username
        const results = files.filter(f =>
            f.title?.toLowerCase().includes(query) ||
            f.description?.toLowerCase().includes(query) ||
            f.category?.toLowerCase().includes(query) ||
            f.subcategory?.toLowerCase().includes(query) ||
            f.username?.toLowerCase().includes(query)
        );

        const paginatedResults = results.slice(start, start + pageSize);

        res.json({
            status: 'success',
            ok: true,
            rows: paginatedResults,
            total: results.length,
            offset: start,
            limit: pageSize,
            query,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/files/:fileId
 * Get specific file details
 */
export const getFileById = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const file = files.find(f => f.id === parseInt(fileId, 10));

        if (!file) {
            return next(new AppError('File not found', 404));
        }

        res.json({
            status: 'success',
            file,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/files/upload
 * Upload new file metadata
 */
export const uploadFile = async (req, res, next) => {
    try {
        const { title, description, category, subcategory, driveUrl, thumbnailUrl } = req.body;
        const { email, username } = req.user;

        // Validate input
        if (!title || !driveUrl) {
            return next(new AppError('Title and driveUrl are required', 400));
        }

        // Validate file metadata
        const validation = validateFileMetadata({ title, category, subcategory });
        if (!validation.valid) {
            return next(new AppError(validation.error, 400));
        }

        // Extract file ID from Google Drive URL
        const fileId = extractDriveFileId(driveUrl);
        if (!fileId) {
            return next(new AppError('Invalid Google Drive URL', 400));
        }

        // Create file entry
        const newFile = {
            id: fileIdCounter++,
            username,
            email,
            title,
            description: description || '',
            category: category || 'student',
            subcategory: subcategory || 'Notes',
            driveUrl,
            fileid: fileId,
            thumbnailUrl: thumbnailUrl || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Add to files array
        files.push(newFile);

        // Clear cache
        cache.flushAll();

        res.status(201).json({
            status: 'success',
            message: 'File uploaded successfully',
            ok: true,
            file: newFile,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PUT /api/files/:fileId
 * Update file information
 */
export const updateFile = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const { email } = req.user;
        const { title, description, category, subcategory } = req.body;

        const file = files.find(f => f.id === parseInt(fileId, 10));

        if (!file) {
            return next(new AppError('File not found', 404));
        }

        // Check if user owns the file
        if (file.email !== email) {
            return next(new AppError('Not authorized to update this file', 403));
        }

        // Update fields
        if (title) file.title = title;
        if (description !== undefined) file.description = description;
        if (category) file.category = category;
        if (subcategory) file.subcategory = subcategory;
        file.updatedAt = new Date();

        // Clear cache
        cache.flushAll();

        res.json({
            status: 'success',
            message: 'File updated successfully',
            file,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /api/files/:fileId
 * Delete file (only owner)
 */
export const deleteFile = async (req, res, next) => {
    try {
        const { fileId } = req.params;
        const { email } = req.user;

        const fileIndex = files.findIndex(f => f.id === parseInt(fileId, 10));

        if (fileIndex === -1) {
            return next(new AppError('File not found', 404));
        }

        // Check if user owns the file
        if (files[fileIndex].email !== email) {
            return next(new AppError('Not authorized to delete this file', 403));
        }

        // Remove file
        files.splice(fileIndex, 1);

        // Clear cache
        cache.flushAll();

        res.json({
            status: 'success',
            message: 'File deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/files/user/me
 * Get current user's uploaded files
 */
export const getUserFiles = async (req, res, next) => {
    try {
        const { email } = req.user;
        const { limit = 20, offset = 0 } = req.query;

        const userFiles = files.filter(f => f.email === email);
        const start = parseInt(offset, 10) || 0;
        const pageSize = parseInt(limit, 10) || 20;

        const paginatedFiles = userFiles.slice(start, start + pageSize);

        res.json({
            status: 'success',
            ok: true,
            rows: paginatedFiles,
            total: userFiles.length,
            offset: start,
            limit: pageSize,
        });
    } catch (err) {
        next(err);
    }
};

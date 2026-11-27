import { Router } from 'express';
import { FILES_SOURCE, UPSTREAM_FILES_URL, FEATURED_LIMIT } from '../config.js';
import { readToken, localFiles, postUpstream, norm, loadFiles, page, extractDriveId, shuffle, handleError } from '../utils/helpers.js';
import { buildTaxonomy } from '../../lib/filesUpstream.js';

const router = Router();

/** GET /api/files?offset&limit&email */
router.get('/', async (req, res) => {
    try {
        const email = norm(req.query.email);
        const all = (await loadFiles()).filter((f) => !email || norm(f.email) === email);
        const { rows, total, offset, limit, hasMore } = page(all, req.query.offset, req.query.limit);
        res.json({ ok: true, rows, total, offset, limit, hasMore });
    } catch (err) {
        handleError(res, err);
    }
});

/** GET /api/files/search?q= */
router.get('/search', async (req, res) => {
    try {
        const query = String(req.query.q || '').trim().toLowerCase();
        if (!query) return res.json({ ok: true, rows: [], total: 0 });
        const matches = (await loadFiles()).filter((f) =>
            [f.title, f.description, f.category, f.subcategory, f.username]
                .join(' ').toLowerCase().includes(query)
        );
        const { rows, total, offset, limit, hasMore } = page(matches, req.query.offset, req.query.limit || 20);
        res.json({ ok: true, rows, total, offset, limit, hasMore, query });
    } catch (err) {
        handleError(res, err);
    }
});

/** POST /api/files/upload */
router.post('/upload', async (req, res) => {
    const user = readToken(req);
    if (!user) return res.status(401).json({ ok: false, msg: 'Not authenticated' });

    const { title, description = '', category = 'student', subcategory = 'Notes', driveUrl, thumbnailUrl = '' } = req.body || {};
    if (!title || !driveUrl) return res.status(400).json({ ok: false, msg: 'Title and driveUrl are required' });

    const fileid = extractDriveId(driveUrl);
    if (!fileid) return res.status(400).json({ ok: false, msg: 'Invalid Google Drive link' });

    try {
        const existing = await loadFiles();
        const normTitle = norm(title);
        const dupFile = existing.find((f) => f.fileid && f.fileid === fileid);
        if (dupFile) {
            return res.status(409).json({
                ok: false, duplicate: true, duplicateType: 'file',
                msg: `This file is already in the library (shared by ${dupFile.username || 'another user'}).`,
            });
        }
        const dupTitle = existing.find((f) => norm(f.title) === normTitle);
        if (dupTitle) {
            return res.status(409).json({
                ok: false, duplicate: true, duplicateType: 'title',
                msg: `A file titled "${dupTitle.title}" already exists. Try a more specific title.`,
            });
        }
    } catch {
        // duplicate check failed — still attempt the upload
    }

    const record = {
        timestamp: new Date().toString(),
        username: user.username, email: user.email,
        category, subcategory, title, description,
        driveurl: driveUrl, fileid, thumbnailurl: thumbnailUrl,
    };

    try {
        if (FILES_SOURCE === 'upstream') {
            const data = await postUpstream(UPSTREAM_FILES_URL, {
                action: 'save', username: record.username, email: record.email,
                category, subcategory, title, description, driveUrl, fileId: fileid, thumbnailUrl,
            });
            return res.status(data.ok ? 201 : 400).json({
                ok: data.ok === true,
                msg: data.msg || data.error || (data.ok ? 'File saved' : 'Save failed'),
                duplicate: data.duplicate === true,
            });
        }
        localFiles.push(record);
        return res.status(201).json({ ok: true, msg: 'File saved', file: record });
    } catch (err) {
        handleError(res, err);
    }
});

/** DELETE /api/files/:fileId */
router.delete('/:fileId', (req, res) => {
    const user = readToken(req);
    if (!user) return res.status(401).json({ ok: false, msg: 'Not authenticated' });
    if (FILES_SOURCE === 'upstream') {
        return res.status(501).json({ ok: false, msg: 'Delete is not supported by the upstream store yet' });
    }
    const index = localFiles.findIndex((f) => f.fileid === req.params.fileId);
    if (index === -1) return res.status(404).json({ ok: false, msg: 'File not found' });
    if (localFiles[index].email !== user.email) return res.status(403).json({ ok: false, msg: 'Not authorized' });
    localFiles.splice(index, 1);
    res.json({ ok: true, msg: 'File deleted' });
});

export default router;

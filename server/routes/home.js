import { Router } from 'express';
import { FEATURED_LIMIT } from '../config.js';
import { norm, loadFiles, shuffle, handleError } from '../utils/helpers.js';
import { buildTaxonomy } from '../../lib/filesUpstream.js';

const router = Router();

/** GET /api/home */
router.get('/home', async (_req, res) => {
    try {
        const all = await loadFiles();
        const seenTitles = new Set();
        const uniqueByTitle = [];
        for (const f of all) {
            const key = norm(f.title);
            if (!key || seenTitles.has(key)) continue;
            seenTitles.add(key);
            uniqueByTitle.push(f);
        }
        const contributors = new Set(all.map((f) => norm(f.email)).filter(Boolean));
        res.json({
            ok: true,
            featured: shuffle(uniqueByTitle).slice(0, FEATURED_LIMIT),
            stats: { files: all.length, titles: uniqueByTitle.length, contributors: contributors.size },
        });
    } catch (err) {
        handleError(res, err);
    }
});

/** GET /api/taxonomy */
router.get('/taxonomy', async (_req, res) => {
    try {
        res.json({ ok: true, categories: buildTaxonomy(await loadFiles()) });
    } catch (err) {
        handleError(res, err);
    }
});

export default router;

/**
 * GET /api/discover/search?q=&page=1&ytToken=
 *
 * Runs community PDFs, YouTube and DEV.to articles in parallel.
 * Each provider has independent error handling — one failure never blocks the others.
 * Results are cached in-memory for 5 minutes per (q, page, ytToken) key.
 */
import { Router } from 'express';
import { YOUTUBE_API_KEY } from '../config.js';
import { loadFiles } from '../utils/helpers.js';

const router = Router();

// ─── Cache ────────────────────────────────────────────────────────────────────
const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getCache(key) {
    const hit = CACHE.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiresAt) { CACHE.delete(key); return null; }
    return hit.data;
}
function setCache(key, data) {
    CACHE.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
    if (CACHE.size > 300) {
        const now = Date.now();
        for (const [k, v] of CACHE) if (now > v.expiresAt) CACHE.delete(k);
    }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PDF_PER_PAGE = 5;
const VID_PER_PAGE = 5;
const ART_PER_PAGE = 5;
const YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YT_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const DEVTO_URL = 'https://dev.to/api/articles';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';
    const h = parseInt(m[1] || '0', 10), min = parseInt(m[2] || '0', 10), sec = parseInt(m[3] || '0', 10);
    return h > 0
        ? `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${String(min).padStart(1, '0')}:${String(sec).padStart(2, '0')}`;
}

// ─── Provider: community PDFs ─────────────────────────────────────────────────
async function searchPdfs(q, page) {
    const ql = q.toLowerCase();
    const all = await loadFiles();
    const matches = all.filter(f =>
        [f.title, f.description, f.category, f.subcategory, f.username]
            .join(' ').toLowerCase().includes(ql)
    );
    const start = (page - 1) * PDF_PER_PAGE;
    const items = matches.slice(start, start + PDF_PER_PAGE).map(f => ({
        id: f.fileid || f.title,
        title: f.title || '',
        description: f.description || '',
        uploader: f.username || '',
        category: f.category || '',
        subcategory: f.subcategory || '',
        fileId: f.fileid || '',
        driveUrl: f.driveurl || '',
        thumbnailUrl: f.thumbnailurl || '',
    }));
    return {
        items,
        total: matches.length,
        page,
        perPage: PDF_PER_PAGE,
        hasMore: start + PDF_PER_PAGE < matches.length,
    };
}

// ─── Provider: YouTube ────────────────────────────────────────────────────────
async function searchVideos(q, ytToken) {
    if (!YOUTUBE_API_KEY) {
        return { items: [], total: 0, page: 1, perPage: VID_PER_PAGE, hasMore: false, unavailable: true, nextToken: null };
    }
    const params = new URLSearchParams({
        part: 'snippet', type: 'video', q,
        maxResults: VID_PER_PAGE, key: YOUTUBE_API_KEY,
        ...(ytToken ? { pageToken: ytToken } : {}),
    });
    const searchData = await fetch(`${YT_SEARCH_URL}?${params}`).then(r => r.json());
    if (searchData.error) throw new Error(searchData.error.message || 'YouTube API error');

    const ids = (searchData.items || []).map(i => i.id?.videoId).filter(Boolean).join(',');
    let durMap = {};
    if (ids) {
        const detailData = await fetch(`${YT_VIDEOS_URL}?${new URLSearchParams({ part: 'contentDetails', id: ids, key: YOUTUBE_API_KEY })}`).then(r => r.json());
        for (const item of detailData.items || []) durMap[item.id] = parseDuration(item.contentDetails?.duration || '');
    }
    const items = (searchData.items || []).map(item => {
        const id = item.id?.videoId || '';
        const s = item.snippet || {};
        return {
            id, title: s.title || '', channel: s.channelTitle || '',
            description: s.description || '',
            thumbnail: s.thumbnails?.medium?.url || s.thumbnails?.default?.url || '',
            publishedAt: s.publishedAt || '', duration: durMap[id] || '',
            url: `https://www.youtube.com/watch?v=${id}`,
            embedUrl: `https://www.youtube.com/embed/${id}`,
        };
    });
    return {
        items,
        total: searchData.pageInfo?.totalResults || items.length,
        perPage: VID_PER_PAGE,
        hasMore: !!searchData.nextPageToken,
        nextToken: searchData.nextPageToken || null,
        prevToken: searchData.prevPageToken || null,
    };
}

// ─── Provider: DEV Community articles ────────────────────────────────────────
async function searchArticles(q, page) {
    const params = new URLSearchParams({ q, per_page: ART_PER_PAGE, page });
    const res = await fetch(`${DEVTO_URL}?${params}`, {
        headers: { 'User-Agent': 'KnowledgeHub/2.0 (educational platform)' },
        signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`DEV.to responded with ${res.status}`);
    const data = await res.json();
    const items = (Array.isArray(data) ? data : []).map(a => ({
        id: String(a.id),
        title: a.title || '',
        description: a.description || '',
        coverImage: a.cover_image || a.social_image || '',
        author: a.user?.name || '',
        authorImage: a.user?.profile_image_90 || '',
        tags: Array.isArray(a.tag_list) ? a.tag_list.slice(0, 4) : [],
        readingTime: a.reading_time_minutes || 0,
        publishedAt: a.published_at || '',
        url: a.url || '',
        source: 'DEV Community',
    }));
    return {
        items,
        total: items.length,
        page,
        perPage: ART_PER_PAGE,
        hasMore: items.length === ART_PER_PAGE,
    };
}

// ─── Route ────────────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const ytToken = req.query.ytToken || null;

    if (!q) {
        return res.json({
            ok: true, q: '', page: 1,
            providers: {
                pdfs:     { status: 'ok', items: [], total: 0, hasMore: false },
                videos:   { status: 'ok', items: [], total: 0, hasMore: false, nextToken: null },
                articles: { status: 'ok', items: [], total: 0, hasMore: false },
            },
        });
    }

    const ck = `${q.toLowerCase()}|${page}|${ytToken || ''}`;
    const cached = getCache(ck);
    if (cached) return res.json({ ...cached, cached: true });

    const [pdfsResult, videosResult, articlesResult] = await Promise.allSettled([
        searchPdfs(q, page),
        searchVideos(q, ytToken),
        searchArticles(q, page),
    ]);

    const wrap = (result, unavailableMsg) =>
        result.status === 'fulfilled'
            ? { status: result.value.unavailable ? 'unavailable' : 'ok', ...result.value }
            : { status: 'error', msg: result.reason?.message || 'Provider failed', items: [], total: 0, hasMore: false };

    const providers = {
        pdfs:     wrap(pdfsResult),
        videos:   wrap(videosResult),
        articles: wrap(articlesResult),
    };

    const response = { ok: true, q, page, providers };
    setCache(ck, response);
    res.json(response);
});

export default router;

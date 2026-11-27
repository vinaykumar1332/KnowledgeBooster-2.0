import { Router } from 'express';
import { YOUTUBE_API_KEY } from '../config.js';

const router = Router();

const YT_SEARCH = 'https://www.googleapis.com/youtube/v3/search';
const YT_VIDEOS = 'https://www.googleapis.com/youtube/v3/videos';

/** GET /api/youtube/search?q=&maxResults=12&pageToken= */
router.get('/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ ok: true, items: [], total: 0 });

    if (!YOUTUBE_API_KEY) {
        return res.status(503).json({ ok: false, msg: 'YouTube API key not configured on the server.' });
    }

    try {
        const maxResults = Math.min(parseInt(req.query.maxResults, 10) || 12, 50);
        const params = new URLSearchParams({
            part: 'snippet',
            type: 'video',
            q,
            maxResults,
            key: YOUTUBE_API_KEY,
            ...(req.query.pageToken ? { pageToken: req.query.pageToken } : {}),
        });

        const searchRes = await fetch(`${YT_SEARCH}?${params}`);
        const searchData = await searchRes.json();

        if (searchData.error) {
            return res.status(502).json({ ok: false, msg: searchData.error.message || 'YouTube API error' });
        }

        const ids = (searchData.items || []).map((i) => i.id?.videoId).filter(Boolean).join(',');

        // Fetch durations in one extra call (contentDetails)
        let durMap = {};
        if (ids) {
            const detailParams = new URLSearchParams({ part: 'contentDetails', id: ids, key: YOUTUBE_API_KEY });
            const detailRes = await fetch(`${YT_VIDEOS}?${detailParams}`);
            const detailData = await detailRes.json();
            for (const item of detailData.items || []) {
                durMap[item.id] = parseDuration(item.contentDetails?.duration || '');
            }
        }

        const items = (searchData.items || []).map((item) => {
            const id = item.id?.videoId || '';
            const s = item.snippet || {};
            return {
                id,
                title: s.title || '',
                channel: s.channelTitle || '',
                description: s.description || '',
                thumbnail: s.thumbnails?.medium?.url || s.thumbnails?.default?.url || '',
                publishedAt: s.publishedAt || '',
                duration: durMap[id] || '',
                url: `https://www.youtube.com/watch?v=${id}`,
                embedUrl: `https://www.youtube.com/embed/${id}`,
            };
        });

        res.json({
            ok: true,
            items,
            total: searchData.pageInfo?.totalResults || items.length,
            nextPageToken: searchData.nextPageToken || null,
            prevPageToken: searchData.prevPageToken || null,
        });
    } catch (err) {
        console.error('YouTube search error:', err.message);
        res.status(502).json({ ok: false, msg: 'YouTube search failed. Please try again.' });
    }
});

/** Convert ISO 8601 duration (PT4M13S) → "4:13" */
function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';
    const h = parseInt(m[1] || '0', 10);
    const min = parseInt(m[2] || '0', 10);
    const sec = parseInt(m[3] || '0', 10);
    const mm = String(min).padStart(h > 0 ? 2 : 1, '0');
    const ss = String(sec).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default router;

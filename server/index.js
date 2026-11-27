import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const _require = createRequire(import.meta.url);
const dotenv = _require('dotenv');
const __dir = dirname(fileURLToPath(import.meta.url));

// Load root .env first (shared secrets like YOUTUBE_API_KEY), then
// server/.env on top so server-specific values can override if needed.
dotenv.config({ path: resolve(__dir, '..', '.env') });
dotenv.config({ path: resolve(__dir, '.env') });

import { PORT, AUTH_SOURCE, FILES_SOURCE } from './config.js';
import app from './app.js';

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('KnowledgeHub Backend Server Started');
    console.log(`URL: http://localhost:${PORT}   auth=${AUTH_SOURCE}   files=${FILES_SOURCE}`);
    console.log('='.repeat(60) + '\n');
});

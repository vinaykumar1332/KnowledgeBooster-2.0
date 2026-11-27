import { PORT, AUTH_SOURCE, FILES_SOURCE } from './config.js';
import app from './app.js';

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('KnowledgeHub Backend Server Started');
    console.log(`URL: http://localhost:${PORT}   auth=${AUTH_SOURCE}   files=${FILES_SOURCE}`);
    console.log('='.repeat(60) + '\n');
});

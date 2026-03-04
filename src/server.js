import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server ignited on http://localhost:${PORT}`);
    console.log('Mode: Development | Environment: WSL-Native');
});
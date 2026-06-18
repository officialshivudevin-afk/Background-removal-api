const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Health Check Route
app.get('/', (req, res) => {
    res.json({ message: "Background Removal API is live!", usage: "POST to /remove-background" });
});

// Main Logic Route
app.post('/remove-background', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    try {
        // Process image: Resize to max 800px width and convert to PNG
        const processedBuffer = await sharp(req.file.buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .png()
            .toBuffer();

        res.set('Content-Type', 'image/png');
        res.send(processedBuffer);
    } catch (err) {
        res.status(500).json({ error: 'Processing failed', details: err.message });
    }
});

module.exports = app;

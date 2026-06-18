const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// POST endpoint
app.post('/remove-background', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded.');

  try {
    // 1. Resize/Compress using Sharp
    let pipeline = sharp(req.file.buffer).resize(800); // Resize to 800px width

    // 2. Background Removal Logic
    // NOTE: For pure local execution, you would integrate a model library here.
    // Given Vercel limitations, this is where you would call an external AI API.
    const processedBuffer = await pipeline.png().toBuffer(); 

    res.set('Content-Type', 'image/png');
    res.send(processedBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

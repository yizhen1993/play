/**
 * ============================================================================
 * Malaysian Cooking Dash — Express Game Server
 * ============================================================================
 */

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const clientPath = path.resolve(__dirname, '../client/public');
const dataDir = path.resolve(__dirname, 'data');
const saveFile = path.join(dataDir, 'saves.json');

app.use(express.json());
app.use(express.static(clientPath));

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Malaysian Cooking Dash',
    version: '1.0.0',
    time: Date.now()
  });
});

// Load player save profile
app.get('/api/profile', (req, res) => {
  try {
    if (fs.existsSync(saveFile)) {
      const data = fs.readFileSync(saveFile, 'utf8');
      return res.json(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading save profile:', err);
  }
  res.json({
    coins: 100,
    unlockedLevel: 1,
    levelStars: {},
    upgrades: {
      wokSpeed: 1,
      drinkSpeed: 1,
      patienceBoost: 1,
      shoesSpeed: 1
    }
  });
});

// Save player progress
app.post('/api/save', (req, res) => {
  try {
    const profile = req.body;
    fs.writeFileSync(saveFile, JSON.stringify(profile, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Fallback to index.html for client SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Cooking Dash] 🍳 Kopitiam & Mamak Rush Online on http://0.0.0.0:${PORT}`);
  console.log(`[Cooking Dash] Serving client from ${clientPath}`);
});

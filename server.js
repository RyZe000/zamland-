const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const WAITLIST_PATH = path.join(DATA_DIR, 'waitlist.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadWaitlist() {
  try {
    if (!fs.existsSync(WAITLIST_PATH)) return [];
    return JSON.parse(fs.readFileSync(WAITLIST_PATH, 'utf-8'));
  } catch (err) {
    console.error('Liste okunamadı:', err.message);
    return [];
  }
}

function saveWaitlist(list) {
  fs.writeFileSync(WAITLIST_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

app.post('/api/waitlist', (req, res) => {
  const { email } = req.body || {};
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi gir.' });
  }
  const normalized = String(email).trim().toLowerCase();
  const list = loadWaitlist();

  if (list.some(item => item.email === normalized)) {
    return res.json({ ok: true, alreadyOnList: true, count: list.length });
  }

  list.push({ email: normalized, createdAt: new Date().toISOString() });
  saveWaitlist(list);
  res.json({ ok: true, alreadyOnList: false, count: list.length });
});

app.get('/api/waitlist/count', (req, res) => {
  res.json({ count: loadWaitlist().length });
});

app.listen(PORT, () => {
  console.log(`Zamlandı bekleme listesi sitesi http://localhost:${PORT} adresinde çalışıyor`);
});

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
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.get('/admin', (req, res) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return res.status(404).send('Bulunamadı.');
  }
  if (req.query.key !== adminKey) {
    return res.status(401).send('Yetkisiz. ?key=... ekle.');
  }
  const list = loadWaitlist().slice().reverse();
  const rows = list.map(item => `
    <tr>
      <td>${escapeHtml(item.email)}</td>
      <td>${escapeHtml(new Date(item.createdAt).toLocaleString('tr-TR'))}</td>
    </tr>`).join('');
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>Zamlandı — Bekleme Listesi</title>
<style>
  body{ font-family:sans-serif; background:#f4f4f0; color:#16241b; padding:32px; }
  h1{ font-size:20px; }
  table{ border-collapse:collapse; width:100%; max-width:600px; background:#fff; }
  td{ padding:10px 14px; border-bottom:1px solid #ddd; font-size:14px; }
  .count{ color:#516152; margin-bottom:20px; }
</style>
</head>
<body>
  <h1>Bekleme Listesi</h1>
  <p class="count">${list.length} kişi</p>
  <table>${rows || '<tr><td>Henüz kimse yok.</td></tr>'}</table>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Zamlandı bekleme listesi sitesi http://localhost:${PORT} adresinde çalışıyor`);
});

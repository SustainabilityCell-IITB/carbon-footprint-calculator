const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'userinfo.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure the data file exists
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read existing data
function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err);
    return [];
  }
}

// Write data
function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/userinfo — Save user info (hostel number + optional name)
app.post('/api/userinfo', (req, res) => {
  const { hostelNo, userName } = req.body;

  if (hostelNo === undefined || hostelNo === null) {
    return res.status(400).json({ error: 'hostelNo is required' });
  }

  const entry = {
    id: Date.now(),
    hostelNo: Number(hostelNo),
    userName: userName || '',
    timestamp: new Date().toISOString(),
  };

  const data = readData();
  data.push(entry);
  writeData(data);

  console.log(`[+] New user info recorded: Hostel ${entry.hostelNo}, Name: "${entry.userName}"`);
  res.status(201).json({ message: 'User info saved successfully', entry });
});

// GET /api/userinfo — Retrieve all user info entries
app.get('/api/userinfo', (req, res) => {
  const data = readData();
  res.json({ count: data.length, entries: data });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌿 Carbon Footprint Calculator - Backend Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Data file:  ${DATA_FILE}\n`);
});

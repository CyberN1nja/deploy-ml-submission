const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// Konfigurasi upload file dengan batasan 1MB
const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

// Middleware
app.use(bodyParser.json());

// Endpoint prediksi
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    const isCancer = Math.random() > 0.5; // Simulasi prediksi
    const response = {
      id: uuidv4(),
      result: isCancer ? 'Cancer' : 'Non-cancer',
      suggestion: isCancer ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.',
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
});

// Error handling untuk ukuran file
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
  }
  res.status(500).json({ status: 'fail', message: err.message });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client')));

// SPA fallback to index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
     user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Feedback POST route
app.post('/send-feedback', async (req, res) => {
  try {
    const { name, experience, rating, comment, features, recommend } = req.body;

    // Log request in dev mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('📥 Feedback received:', req.body);
    }

    // Validation
    if (!name || !experience || !rating || !comment || !recommend) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    // Email content
    const mailOptions = {
  from: '"Portfolio Feedback" <lolbaklol9686@gmail.com>',
  to: 'lolbaklol9686@gmail.com',
  subject: `📬 New Feedback from ${name}`,
  html: `
    <h2>📝 Portfolio Feedback</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Experience:</strong> ${experience}</p>
    <p><strong>Rating:</strong> ${rating}</p>
    <p><strong>Recommend Site:</strong> ${recommend}</p>
    <p><strong>Best Features:</strong> ${features || 'N/A'}</p>
    <p><strong>Comments:</strong><br>${comment}</p>
  `
};

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);

    res.status(200).json({ message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('❌ Error sending feedback email:', error);
    res.status(500).json({ error: 'Failed to send feedback. Please try again later.' });
  }
});

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

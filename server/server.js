const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // From .env
    pass: process.env.EMAIL_PASS, // From .env
  }
});

// POST Endpoint to handle feedback
app.post('/send-feedback', (req, res) => {
  const { name, experience, comment } = req.body;

  // Basic Validation
  if (!name || !experience || !comment) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Feedback from ${name}`,
    html: `
      <h2>📝 New Feedback Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Comment:</strong> ${comment}</p>
    `
  };

  // Send Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error.message);
      return res.status(500).json({ error: 'Failed to send feedback email.' });
    }

    console.log(`✅ Email sent: ${info.response}`);
    res.status(200).json({ message: 'Feedback sent successfully!' });
  });
});

// 404 Catch-All
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

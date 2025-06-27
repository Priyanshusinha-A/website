const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in environment variables!");
  process.exit(1);
}

// Optional: Trust proxy for platforms like Render
app.set('trust proxy', true);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.resolve(__dirname, '../../client')));


// ✅ SPA support: serve index.html for unmatched frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Feedback route
app.post('/send-feedback', async (req, res) => {
  try {
    const { name, experience, rating, comment, features, recommend } = req.body;

    if (!name || !experience || !rating || !comment || !recommend) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    const mailOptions = {
      from: `"Portfolio Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📬 New Feedback from ${name}`,
      html: `
        <h2>📝 Portfolio Feedback</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Recommend:</strong> ${recommend}</p>
        <p><strong>Features:</strong> ${features || 'N/A'}</p>
        <p><strong>Comment:</strong><br>${comment}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
    res.status(200).json({ message: 'Feedback sent successfully!' });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Failed to send feedback. Try again later.' });
  }
});

// ✅ Catch-all for API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


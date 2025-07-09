const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Validate required env vars
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in environment variables!");
  process.exit(1);
}

// ✅ Trust proxy (optional)
app.set('trust proxy', true);

// ✅ Security headers
app.use(helmet());

// ✅ Allow JSON request bodies
app.use(express.json());

// ✅ Allow CORS only for Live Server origin
app.use(cors({
  origin: 'http://127.0.0.1:5500', // <-- Live Server default
  methods: ['GET', 'POST'],
}));

// ✅ Nodemailer transporter
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

// ✅ Catch-all for bad API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

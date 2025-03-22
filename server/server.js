const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'priyanshusinhatt@gmail.com', // Your Gmail Address
    pass: 'zvul rwxg ljwe jumo' // App Password (Not your Gmail password)
  }
});

// Endpoint to Receive Feedback
app.post('/send-feedback', (req, res) => {
  const { name, experience, comment } = req.body;

  // Compose the Email
  const mailOptions = {
    from: 'priyanshusinhatt@gmail.com',
    to: 'priyanshusinhatt@gmail.com',
    subject: `New Feedback from ${name}`,
    html: `
      <h2>New Feedback Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Comment:</strong> ${comment}</p>
    `
  };

  // Send Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Feedback sent successfully!' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

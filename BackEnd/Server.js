const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Database Integration
connectDB();

// Communication Middlewares
app.use(cors());
app.use(express.json());

// API Routers Links
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.listen(5000, () => console.log("Blog Backend server running cleanly on port 5000"));
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');
require('./utils/cronJobs');

const dashboardRoutes = require('./routes/dashboardRoutes')
const quizRoutes = require('./routes/quizRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/friends', friendRoutes);
app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
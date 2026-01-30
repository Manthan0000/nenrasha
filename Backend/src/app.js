const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.get('/',(req,res) => {
    res.send("Nenrasha API Running");
});

module.exports = app;
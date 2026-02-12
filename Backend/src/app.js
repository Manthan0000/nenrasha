const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost and IP
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/productRoutes');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productRoutes);

app.get('/',(req,res) => {
    res.send("Nenrasha API Running");
});

module.exports = app;
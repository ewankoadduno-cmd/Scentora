const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth.routes');
const orderRoutes = require('./src/routes/orders.routes');
const productRoutes = require('./src/routes/products.routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Connection Error:", error);
});

app.get('/', (req, res) => {
    res.send('Hello World! Your Express server is running.');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

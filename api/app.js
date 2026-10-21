const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth.routes');
const orderRoutes = require('./src/routes/orders.routes');
const productRoutes = require('./src/routes/products.routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let connectionPromise;

async function connectDatabase() {
    if (mongoose.connection.readyState === 1) return;
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');

    // Share connection setup between concurrent requests on a Vercel instance.
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        }).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    await connectionPromise;
    connectionPromise = undefined;
}

app.use(cors());
app.use(express.json());

app.use('/api', async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch {
        console.error('MongoDB connection unavailable. Check the server environment and Atlas network access.');
        res.status(503).json({
            status: 'unavailable',
            database: 'disconnected',
            message: 'Database is temporarily unavailable. Please try again later.',
        });
    }
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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
    });
}

module.exports = app;

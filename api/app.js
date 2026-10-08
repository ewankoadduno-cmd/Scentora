const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = 3000; 


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

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

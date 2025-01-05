const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/supplierDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});


// Routes
app.use('/api/suppliers', require('./routes/supplierRoutes'));




// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema and model for the data
const DataSchema = new mongoose.Schema({
    name: String,
    socialSecurityNumber: String,
    creditScore: Number,
});

const Data = mongoose.model('Data', DataSchema);


// Endpoint to receive user input and store it in MongoDB
app.post('/api/data', async (req, res) => {
    const { name, socialSecurityNumber } = req.body;

    try {
        // Check if the data already exists
        const existingData = await Data.findOne({ 
            $or: [
                { name: name }, 
                { socialSecurityNumber: socialSecurityNumber }
            ]
        });

        if (existingData) {
            // If data exists, return the existing data
            return res.json({ message: 'Data already exists', data: existingData });
        }

        // If data does not exist, save the new data
        const newData = new Data({ name, socialSecurityNumber });
        await newData.save();
        res.json({ message: 'Data saved to MongoDB', data: newData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// how to store inputs into mongodb and store profile link a credit score
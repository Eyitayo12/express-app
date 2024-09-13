const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const uri = "mongodb+srv://Teegirl:upgirl123@cluster0.6ehw8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// middleware
app.use(express.json());

// schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// create model
const User = mongoose.model('User', userSchema);

// connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB Atlas', err);
    });

app.get('/', (req, res) => {
    res.send('Welcome page');
});

app.get('/visit', (req, res) => {
    res.send('Visit page');
});

app.post('/info', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            age: req.body.age
        });
        await newUser.save();
        res.json({
            message: 'Data saved successfully',
            data: newUser
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to save data',
            error: err.message
        });
    }
});

app.get('/users', async (req, res) => { 
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) { 
        res.status(500).json({
            message: 'Failed to retrieve users',
            error: err.message
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to retrieve user',
            error: error.message
        });
    }
});

app.put('/updateUsers/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to update user',
            error: error.message
        });
    }
});

app.delete('/deleteUsers/:id', async (req, res) => {
    const userId = req.params.id;

    // Validate MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        // Find the user by ID and delete it
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to delete user',
            error: error.message
        });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

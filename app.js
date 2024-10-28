const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI
const uri = "mongodb+srv://leox5621:D0zR1u5Z0saTZewO@cluster0.cq0tl.mongodb.net/Nilou-Chatbot?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectToDB();

// Define a simple GET endpoint
app.get('/api/messages', async (req, res) => {
    try {
        const db = client.db("Nilou-Chatbot");
        const messages = await db.collection('nilou').find({}).toArray();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST endpoint to add a new message
app.post('/api/messages', async (req, res) => {
    try {
        const db = client.db("Nilou-Chatbot");
        const newMessage = req.body; // Expecting { message: "your message", replies: ["reply1", "reply2"] }
        await db.collection('nilou').insertOne(newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add message' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

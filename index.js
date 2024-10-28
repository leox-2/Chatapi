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

// Call the function to connect to the database
connectToDB();

// Define a simple GET endpoint to fetch replies based on user input
app.get('/api/reply/:message', async (req, res) => {
    try {
        const message = req.params.message.toLowerCase().trim();
        const db = client.db("Nilou-Chatbot");

        // Fetch the response from the database
        const responseMsg = await db.collection('nilou').findOne({ message: message });

        if (responseMsg && responseMsg.replies && responseMsg.replies.length > 0) {
            const randomReply = responseMsg.replies[Math.floor(Math.random() * responseMsg.replies.length)];
            res.json({ reply: randomReply });
        } else {
            res.json({ reply: "Kindly teach me!!!" });
        }
    } catch (error) {
        console.error('Failed to fetch reply:', error);
        res.status(500).json({ error: 'Failed to fetch reply' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
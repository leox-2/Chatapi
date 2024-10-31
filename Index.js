const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI directly added
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

// Helper function to generate all sub-phrases of the input message
function generateSubPhrases(message) {
    const words = message.split(" ");
    const subPhrases = [];

    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= words.length; j++) {
            subPhrases.push(words.slice(i, j).join(" "));
        }
    }

    return subPhrases.reverse(); // Reverse to prioritize longer sub-phrases
}

// Define a GET endpoint to fetch replies based on user input
app.get('/api/reply/:message', async (req, res) => {
    try {
        const message = req.params.message.trim();
        const db = client.db("Nilou-Chatbot");

        // Generate all possible sub-phrases of the message
        const subPhrases = generateSubPhrases(message);

        // Check each sub-phrase in MongoDB
        for (const phrase of subPhrases) {
            const responseMsg = await db.collection('nilou').findOne({ message: { $regex: `^${phrase}$`, $options: 'i' } });
            if (responseMsg && responseMsg.replies && responseMsg.replies.length > 0) {
                const randomReply = responseMsg.replies[Math.floor(Math.random() * responseMsg.replies.length)];
                return res.json({ reply: randomReply });
            }
        }

        // If no match found, return the default response
        res.json({ reply: "Kindly teach me! 😿" });
    } catch (error) {
        console.error('Failed to fetch reply:', error);
        res.status(500).json({ error: 'Failed to fetch reply', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

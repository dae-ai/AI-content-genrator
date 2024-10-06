
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Check for API_KEY in the environment
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from the environment variables");
  process.exit(1); 
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    let content = result.response.text();


    content = content.replace(/\*/g, '');

    return content;
  } catch (err) {
    console.error("Error generating content:", err);
    throw err; 
  }
};


app.post('/api/content', async (req, res) => {
  try {
    const { question } = req.body;


    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Prompt cannot be empty." });
    }

    const result = await generate(question);
    res.json({ Result: result || 'No content generated.' });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve only the HTML file
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

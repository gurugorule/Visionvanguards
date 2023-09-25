const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5555;

app.use(bodyParser.json());

// Replace with your OpenAI API key
const apiKey = 'cJTtyGWD0DyVyBbz5SE9T3BlbkFJjDbd7gqYkgGDrxqYFSEa';

// Read the initial chat history from the 'initialPrompt.txt' file
const path = require('path');
const initialChatHistory = fs.readFileSync(path.join(__dirname, 'initialPrompt.txt'), 'utf-8').trim();

// Initialize the chat history with the template prompt
const chatHistory = [
  { role: 'system', content: 'Assistant initialized.' },
  { role: 'assistant', content: initialChatHistory },
];

app.post('/api/chat', async (req, res) => {
  try {
    // Extract user-provided chat history, user message, and initial chat history from the request
    const { userChatHistory } = req.body;

    // Combine the initial chat history, user-provided chat history, and the new user message
    const combinedChatHistory = [
      ...chatHistory,
      ...userChatHistory,
    ];

    // Make a POST request to the OpenAI API to get a response
    const response = await axios.post(
      'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
      {
        prompt: combinedChatHistory.map((message) => `${message.role}: ${message.content}`).join('\n'),
        max_tokens: 50, // Adjust as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const chatResponse = response.data.choices[0].text;

    // Send only the chat response to the frontend
    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error processing chat request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

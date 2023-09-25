const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5555;

app.use(bodyParser.json());

// Replace with your Eleven Labs API key
const ELEVENLABS_API_KEY = '270846e0b2f4a003331a129712586ced';

app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;

    // Prepare the request headers
    const headers = {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    };

    // Prepare the request data
    const data = {
      'text': text,
      'model_id': 'eleven_monolingual_v1',
      'voice_settings': {
        'stability': 0.6,
        'similarity_boost': 0.85
      }
    };

    // Send a POST request to the Eleven Labs API
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/voice_id', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    // Check if the request was successful
    if (response.ok) {
      const audioBuffer = await response.buffer();
      // Save the audio to a file if needed
      fs.writeFileSync('output.mp3', audioBuffer);

      // Return the audio as a response
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } else {
      res.status(500).json({ error: 'Text-to-speech conversion failed' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

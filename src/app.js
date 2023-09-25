const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

const port = process.env.PORT || 5555;

app.use(express.json());

// Configure multer to store uploaded files in a specific directory
const upload = multer({ dest: 'uploads/' });

// Use the cors middleware to enable CORS
app.use(cors());

// Define your OpenAI API key
const apiKey = 'cJTtyGWD0DyVyBbz5SE9T3BlbkFJjDbd7gqYkgGDrxqYFSEa'; // Replace with your actual API key

app.post('/api/upload-and-transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file; // This contains information about the uploaded file

    // Check if an audio file was uploaded
    if (!audioFile) {
      console.log("No audio received!");
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Define the audio file path
    const audioFilePath = audioFile.path;

    // Read the audio file as binary data
    const audioData = fs.readFileSync(audioFilePath);

    // Make a POST request to the Whisper API for transcription
    const whisperResponse = await axios.post('https://api.openai.com/v1/whisper/recognize', audioData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'audio/wav', // Adjust the content type based on your audio format
      },
    });

    // Extract the transcribed text from the API response
    const transcription = whisperResponse.data.text;

    // Respond with the transcribed text
    res.status(200).json({ message: 'Audio file uploaded and transcribed successfully', transcription });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error transcribing audio' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

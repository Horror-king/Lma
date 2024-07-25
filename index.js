const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const rapidApiKey = '6a381d6a7bmsh822a533b6f6dbfdp1530dbjsn38b24a6d2e6c'; // Replace with your RapidAPI key
const rapidApiHost = 'llama-3.p.rapidapi.com';

app.use(cors()); // Enable CORS

app.get('/llama', (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  const options = {
    method: 'POST',
    hostname: rapidApiHost,
    path: '/llama3',
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
      'Content-Type': 'application/json'
    }
  };

  const apiReq = https.request(options, apiRes => {
    let chunks = [];

    apiRes.on('data', chunk => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      try {
        const response = JSON.parse(body.toString());
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Error parsing response from Llama API' });
      }
    });
  });

  apiReq.on('error', error => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });

  apiReq.write(JSON.stringify({ 
    prompt: prompt,
    system_prompt: 'You are a friendly chat bot.'
  }));
  apiReq.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

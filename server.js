const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require ('dotenv')

const app = express();


// Enable CORS for all routes
app.use(cors());
dotenv.config();

const PORT = process.env.PORT; // You can change this to any port you'd like
const API_BASE_URL = process.env.DEADLINE_WEBSERVICE_URL

// Endpoint to proxy API requests
app.get('/api/*', async (req, res) => {
  try {
    // Extract the path after /api/ and append it to the target API URL
    const apiPath = req.params[0];
    const targetUrl = `${API_BASE_URL}/${apiPath}`;

    // Use axios to make the request to the target API
    const response = await axios.get(targetUrl, {
      headers: { ...req.headers }, // Forward headers if needed
    });

    // Send the API response back to the client
    res.json(response.data);
  } catch (error) {
    // Handle any errors
    console.error('Error making API request:', error);
    res.status(500).send('An error occurred while processing the request');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Deadline API Proxy server running on http://localhost:${PORT}`);
});

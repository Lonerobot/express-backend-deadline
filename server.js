const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require ('dotenv')

const app = express();

app.set('trust proxy', true);

// Enable CORS for all routes
app.use(cors());
dotenv.config();

const PORT = process.env.PORT; 
const API_BASE_URL = process.env.DEADLINE_WEBSERVICE_URL

// Middleware to log the client IP and other details for every request
app.use((req, res, next) => {
  // Use 'x-forwarded-for' header or req.ip to get the client IP
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(`Incoming request from IP: ${clientIp}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  next(); // Pass the request to the next middleware or route handler
});

// Root route to display a friendly message
app.get('/', (req, res) => {
  res.send(`THE LINE - Deadline API Proxy Server v${process.env.VERSION} is running...`);
});

// Endpoint to proxy API requests
app.get('/api/*', async (req, res) => {
  try {

    // Extract the path after /api/ and append it to the target API URL
    const apiPath = req.params[0];
    const targetUrl = `${API_BASE_URL}/${apiPath}`;

    console.log(`Forwarding request to: ${targetUrl}`);

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




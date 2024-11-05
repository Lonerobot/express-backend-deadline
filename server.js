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

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #8bc34a;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          h2 {
            color: #333;
          }
          p {
            font-size: 12px;
            font-weight: bolder;
            color: #FFEB3B;
            text-transform : uppercase;            
          }
          div {
            font-size: 48px;     
            padding: 4px;   
          }
        </style>
      </head>
      <body>
        <h2>THE LINE</h2>
        <div>🐭</div>
        <p> Deadline API Proxy Server v${process.env.VERSION} is running...</p>
      </body>
    </html>
  `);
});

// Endpoint to proxy API requests
app.get('/api/*', async (req, res) => {
  try {
    // Extract the path after /api/
    const apiPath = req.params[0];

    // Construct the full target URL with query parameters
    const queryString = req.url.split('?')[1]; // Get the query string
    const targetUrl = queryString
      ? `${API_BASE_URL}/${apiPath}?${queryString}`
      : `${API_BASE_URL}/${apiPath}`;

    console.log(`Query request : ${queryString}`);
    console.log(`Forwarding request to: ${targetUrl}`);

    // Use axios to make the request to the target API, forwarding headers if needed
    const response = await axios.get(targetUrl, {
      headers: { ...req.headers },
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




const http = require('http');
const fs = require('fs');

// File paths for data storage
const bootcampsFile = './bootcamps.json';
const reviewsFile = './reviews.json';

// Helper functions to read and write data
const readDataFromFile = (file, callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data || '[]'));
    }
  });
};

const writeDataToFile = (file, data, callback) => {
  fs.writeFile(file, JSON.stringify(data), 'utf8', callback);
};

// Creating the server
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Common headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // GET /api/bootcamps - Get all bootcamps
  if (method === 'GET' && url === '/bootcamps') {
    readDataFromFile(bootcampsFile, (bootcamps) => {
      res.writeHead(200);
      res.end(JSON.stringify(bootcamps));
    });

  // GET /api/bootcamps/:id - Get a single bootcamp
  } else if (method === 'GET' && url.startsWith('/bootcamps/')) {
    const id = url.split('/')[3];
    readDataFromFile(bootcampsFile, (bootcamps) => {
      const bootcamp = bootcamps.find(b => b.id === id);
      if (!bootcamp) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Bootcamp not found' }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(bootcamp));
      }
    });

  // POST /api/reviews - Submit a review
  } else if (method === 'POST' && url === '/api/reviews') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newReview = JSON.parse(body);
      readDataFromFile(reviewsFile, (reviews) => {
        newReview.id = Date.now().toString();
        reviews.push(newReview);
        writeDataToFile(reviewsFile, reviews, () => {
          res.writeHead(201);
          res.end(JSON.stringify(newReview));
        });
      });
    });

  // GET /api/reviews/:id - Get reviews for a specific bootcamp
  } else if (method === 'GET' && url.startsWith('/api/reviews/')) {
    const bootcampId = url.split('/')[3];
    readDataFromFile(reviewsFile, (reviews) => {
      const bootcampReviews = reviews.filter(r => r.bootcampId === bootcampId);
      res.writeHead(200);
      res.end(JSON.stringify(bootcampReviews));
    });

  } else {
    // Handle invalid routes
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Server listens on port 5000
server.listen(5000, () => {
  console.log('Server running on port 5000');
});

const bootcamps = [
  {
    id: '1',
    name: 'Fullstack Bootcamp',
    location: 'Cape Town',
    description: 'An intensive bootcamp for fullstack developers.'
  }
];

// GET /api/bootcamps - Get all bootcamps
if (method === 'GET' && url === '/api/bootcamps') {
  res.writeHead(200);
  res.end(JSON.stringify(bootcamps));

// GET /api/bootcamps/:id - Get a single bootcamp
} else if (method === 'GET' && url.startsWith('/api/bootcamps/')) {
  const id = url.split('/')[3];
  const bootcamp = bootcamps.find(b => b.id === id);
  if (!bootcamp) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Bootcamp not found' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify(bootcamp));
  }
}

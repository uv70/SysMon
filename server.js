const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');
  
  const cpuInterval = setInterval(async () => {
    try {
      const cpuLoad = await si.currentLoad();
      socket.emit('cpuData', {
        cpu: cpuLoad.currentLoad.toFixed(2)
      });
    } catch (error) {
      console.error('Error getting CPU data:', error);
    }
  }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(cpuInterval);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
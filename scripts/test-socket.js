const axios = require('axios');
const { io } = require('socket.io-client');

const API_URL = 'http://localhost:3000';

async function testSocket() {
  try {
    // 1. Login to get a token
    console.log('Attempting to log in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'ko@hotmail.com',
      password: '1234999',
    });

    const token = loginResponse.data.data.token;
    console.log('Login successful, got token.');

    // 2. Connect to the socket server with the token
    console.log('Connecting to WebSocket...');
    const socket = io(API_URL, {
      auth: {
        token: token,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully!', 'Socket ID:', socket.id);
      // You can add more test-99887 logic here, like emitting an event

      // Disconnect after a few seconds for a clean test-99887 run
      setTimeout(() => {
        socket.disconnect();
      }, 3000);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected.');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

  } catch (error) {
    if (error.response) {
      console.error('HTTP Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testSocket();

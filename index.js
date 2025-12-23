const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const mqttUrl = process.env.MQTT_URL;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

console.log(`Starting Backend Bridge...`);

const mqttClient = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: 'bridge-server-' + Math.random().toString(16).substr(2, 6),
    rejectUnauthorized: false
});

const activeSubscriptions = new Set();

mqttClient.on('connect', () => {
    console.log('Connected to CloudAMQP via MQTT (TCP)');
});

mqttClient.on('message', (topic, message) => {
    // Broadcast to ALL connected clients. They will filter by topic locally.
    // This is more robust than Socket.IO rooms for this scale.
    io.emit('mqtt-message', { topic, message: message.toString() });
});

mqttClient.on('error', (err) => {
    console.error('MQTT error:', err.message);
});

io.on('connection', (socket) => {
    socket.on('subscribe', (topic) => {
        socket.join(topic);
        if (!activeSubscriptions.has(topic)) {
            mqttClient.subscribe(topic, { qos: 1 }, (err) => {
                if (!err) {
                    activeSubscriptions.add(topic);
                }
            });
        }
    });

    socket.on('publish', ({ topic, message }) => {
        mqttClient.publish(topic, message, { qos: 1 });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

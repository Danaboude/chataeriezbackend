# MQTT Backend Bridge

This is a Node.js server that acts as a bridge between an Angular frontend (via Socket.IO) and a CloudAMQP MQTT broker (via TCP).

## why this exists?
Standard browsers cannot connect to CloudAMQP via MQTT WebSockets (`wss://`) on free/shared plans. This server solves that by:
1. Connecting to CloudAMQP using **MQTT over TCP** (Port 8883) — which is supported.
2. Exposing a **Socket.IO** endpoint for the Angular browser to connect to.

## Architecture
`Angular (Browser) <--> Socket.IO <--> Node.js Bridge <--> MQTT (TCP) <--> CloudAMQP`

## Prerequisites
- Node.js (v18 or higher)
- A CloudAMQP instance

## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder:
   ```env
   MQTT_URL=mqtts://your-server.cloudamqp.com:8883
   MQTT_USERNAME=your-username:your-username
   MQTT_PASSWORD=your-password
   PORT=3001
   ```
   *Note: Use the `vhost:username` format for the MQTT_USERNAME if needed.*

## Usage
Start the server:
```bash
npm start
```
The server will be running at `http://localhost:3001`.

## Deployment (Render.com)
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add `MQTT_URL`, `MQTT_USERNAME`, and `MQTT_PASSWORD` in the Render dashboard.

````markdown
# Tic-Tac-Toe Multiplayer

A real-time multiplayer Tic-Tac-Toe game built with React Native, Node.js, Express, Socket.io, and MongoDB.  
Players can join a lobby, get matched, play in real-time, and even reconnect to ongoing games.

---

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Server Setup](#server-setup)
- [Client Setup](#client-setup)
- [Project Structure](#project-structure)
- [Gameplay](#gameplay)
- [Contributing](#contributing)
- [License](#license)


---

## Features
- Real-time multiplayer Tic-Tac-Toe using **Socket.io**
- Matchmaking for two players
- Persistent game state using **MongoDB**
- Reconnect to ongoing games after refresh or reload
- Track turns and announce winner
- Simple, responsive UI built with React Native

---

## Tech Stack
**Frontend:**
- React Native
- React Navigation
- Socket.io-client

**Backend:**
- Node.js
- Express
- Socket.io
- MongoDB (Mongoose)
- dotenv
- CORS

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm
- MongoDB instance (local or Atlas)
- React Native CLI or Expo

---

## Server Setup
1. Navigate to the server folder:
   ```bash
   cd tictactoe-server
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the server root:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server:

   ```bash
   npm start
   ```
5. Server should run at `http://localhost:5000` and show:

   ```
   Server running on port 5000
   MongoDB Connected
   ```

---

## Client Setup

1. Navigate to the React Native app folder:

   ```bash
   cd tictactoe-app
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the app:

   ```bash
   npx react-native run-android   # For Android
   npx react-native run-ios       # For iOS
   ```
4. Enter your username, join a lobby, and play!

---

## Project Structure

```
tictactoe-server/
├─ models/
│  └─ Game.js           # Mongoose schema for games
├─ socket/
│  └─ gameHandler.js    # Socket.io event handling
├─ utils/
│  └─ gameLogic.js      # Tic-Tac-Toe logic
├─ routes/
│  └─ leaderboard.js
├─ server.js             # Entry point
├─ config/
│  └─ db.js             # MongoDB connection
└─ package.json

tictactoe-app/
├─ screens/
│  ├─ HomeScreen.tsx
│  ├─ LobbyScreen.tsx
│  └─ GameScreen.tsx
├─ components/
│  └─ Board.tsx
├─ services/
│  └─ socket.ts         # Socket.io client
├─ App.tsx
└─ package.json
```

---

## Gameplay

1. Enter your name on the Home screen.
2. Wait in the Lobby for a match (or be matched automatically).
3. Play Tic-Tac-Toe in real-time.
4. Game announces the winner once the board is complete.
5. Refresh or reload, and you will reconnect to your ongoing game.

---

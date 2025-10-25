// models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [
    {
      id: String,
      username: String,
    },
  ],
  board: { type: [String], default: Array(9).fill(null) },
  turn: { type: String }, 
  winner: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Game", gameSchema);

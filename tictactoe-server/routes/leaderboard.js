import express from "express";
import Game from "../models/Game.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Get all games that have a winner or a draw
    const games = await Game.find({ winner: { $ne: null } });

    // Aggregate player stats
    const leaderboard = {};

    games.forEach((game) => {
      if (!game.players || game.players.length !== 2) return; // safety check

      const [player1Obj, player2Obj] = game.players;
      const player1 = player1Obj.username;
      const player2 = player2Obj.username;

      // Initialize players in leaderboard
      if (!leaderboard[player1]) {
        leaderboard[player1] = { username: player1, wins: 0, draws: 0, losses: 0 };
      }
      if (!leaderboard[player2]) {
        leaderboard[player2] = { username: player2, wins: 0, draws: 0, losses: 0 };
      }

      // Update stats based on winner
      if (game.winner === "Draw") {
        leaderboard[player1].draws += 1;
        leaderboard[player2].draws += 1;
      } else if (leaderboard[game.winner]) {
        // normal win/loss
        leaderboard[game.winner].wins += 1;
        const loser = player1 === game.winner ? player2 : player1;
        leaderboard[loser].losses += 1;
      } else {
        console.warn(`Game ${game.roomId} has invalid winner: ${game.winner}`);
      }
    });

    // Convert to array and sort by wins descending, then draws descending
    const topPlayers = Object.values(leaderboard)
      .sort((a, b) => b.wins - a.wins || b.draws - a.draws)
      .slice(0, 10);

    res.json(topPlayers);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

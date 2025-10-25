import { v4 as uuidv4 } from "uuid";
import { checkWinner } from "../utils/gameLogic.js";
import Game from "../models/Game.js";

const queue = [];
const playerMap = new Map();

export default (io, socket) => {
  // Player looking for a match
  socket.on("find_match", async (username) => {
    playerMap.set(username, socket.id);
    queue.push({ id: socket.id, username });

    if (queue.length >= 2) {
      const [p1, p2] = queue.splice(0, 2);
      const roomId = uuidv4();

      const game = new Game({
        roomId,
        players: [
          { id: p1.id, username: p1.username },
          { id: p2.id, username: p2.username },
        ],
        board: Array(9).fill(null),
        turn: p1.id,
      });
      await game.save();

      io.to(p1.id).socketsJoin(roomId);
      io.to(p2.id).socketsJoin(roomId);

      io.to(roomId).emit("match_found", {
        roomId,
        players: [p1.username, p2.username],
        turn: p1.username,
      });
    }
  });

  // Player makes a move
socket.on("make_move", async ({ roomId, index }) => {
  const game = await Game.findOne({ roomId });
  if (!game || game.board[index]) return;
  if (game.turn !== socket.id) return;

  const mark = game.players[0].id === socket.id ? "X" : "O";
  game.board[index] = mark;

  // ✅ Check if there’s a winner or draw
  const winnerMark = checkWinner(game.board);

  console.log("WinnerMark:", winnerMark, "Board Full:", !game.board.includes(null));

  let gameOver = false;

  if (winnerMark) {
    // Found a winner
    game.winner =
      winnerMark === "X"
        ? game.players[0].username
        : game.players[1].username;
    gameOver = true;
  } else if (!game.board.includes(null)) {
    // Board full — no winner => Draw
    game.winner = "Draw";
    gameOver = true;
  }

  // ✅ Only switch turn if the game is NOT over
  if (!gameOver) {
    game.turn =
      game.turn === game.players[0].id
        ? game.players[1].id
        : game.players[0].id;
  }

  // ✅ Save once at the end
  await game.save();

  // Send board updates
  io.to(roomId).emit("updateBoard", {
    board: game.board,
    nextTurn: !gameOver
      ? game.players.find((p) => p.id === game.turn).username
      : null,
  });

  // ✅ Handle Game Over properly
  if (gameOver) {
    // Update leaderboard stats
    const [p1, p2] = game.players;
    if (game.winner === "Draw") {
      p1.draws = (p1.draws || 0) + 1;
      p2.draws = (p2.draws || 0) + 1;
    } else {
      const winnerPlayer = game.players.find(
        (p) => p.username === game.winner
      );
      const loserPlayer = game.players.find(
        (p) => p.username !== game.winner
      );
      if (winnerPlayer && loserPlayer) {
        winnerPlayer.wins = (winnerPlayer.wins || 0) + 1;
        loserPlayer.losses = (loserPlayer.losses || 0) + 1;
      }
    }

    await game.save();
    io.to(roomId).emit("gameOver", { winner: game.winner });
  }
});


  // Player reconnects
  socket.on("reconnect_game", async ({ roomId, username }) => {
    try {
      const game = await Game.findOne({ roomId });
      if (!game) return;

      const player = game.players.find((p) => p.username === username);
      if (player) {
        player.id = socket.id;
        await game.save();
      }

      socket.join(roomId);

      io.to(socket.id).emit("updateBoard", {
        board: game.board,
        nextTurn: game.players.find((p) => p.id === game.turn)?.username,
      });

      playerMap.set(username, socket.id);
      console.log(`${username} reconnected to room ${roomId}`);
    } catch (err) {
      console.error("Reconnect failed:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
};

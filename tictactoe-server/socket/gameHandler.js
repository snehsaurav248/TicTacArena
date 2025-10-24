import { v4 as uuidv4 } from "uuid";
import { checkWinner } from "../utils/gameLogic.js";
import Game from "../models/Game.js";

const queue = [];

export default (io, socket) => {
  // Player looking for a match
  socket.on("find_match", async (username) => {
    queue.push({ id: socket.id, username });

    if (queue.length >= 2) {
      const [p1, p2] = queue.splice(0, 2);
      const roomId = uuidv4(); // generate unique room ID

      // Create game in DB
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

      // Join players to Socket.io room
      io.to(p1.id).socketsJoin(roomId);
      io.to(p2.id).socketsJoin(roomId);

      // Notify players
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

    // Determine mark (X or O)
    const mark = game.players[0].id === socket.id ? "X" : "O";
    game.board[index] = mark;

    const winner = checkWinner(game.board);

    // Switch turn
    game.turn =
      game.turn === game.players[0].id ? game.players[1].id : game.players[0].id;

    if (winner) game.winner = winner;

    await game.save();

    io.to(roomId).emit("updateBoard", {
      board: game.board,
      nextTurn: game.players.find((p) => p.id === game.turn).username,
    });

    if (winner) {
      io.to(roomId).emit("gameOver", { winner });
      // Cleanup the game after over to prevent duplicate roomId issues
      await Game.deleteOne({ roomId });
    }
  });

  // Player reconnects to an existing game
  socket.on("reconnect_game", async ({ roomId }) => {
    const game = await Game.findOne({ roomId });
    if (game) {
      socket.join(roomId);

      io.to(socket.id).emit("updateBoard", {
        board: game.board,
        nextTurn: game.players.find((p) => p.id === game.turn).username,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
};

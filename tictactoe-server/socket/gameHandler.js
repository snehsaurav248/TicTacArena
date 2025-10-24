import { checkWinner } from "../utils/gameLogic.js";

const queue = [];
const games = {};

export default (io, socket) => {
  socket.on("find_match", (username) => {
    queue.push({ id: socket.id, username });

    if (queue.length >= 2) {
      const [p1, p2] = queue.splice(0, 2);
      const roomId = `${p1.id}-${p2.id}`;
      games[roomId] = {
        board: Array(9).fill(null),
        turn: p1.id,
        players: [p1, p2],
      };

      io.to(p1.id).socketsJoin(roomId);
      io.to(p2.id).socketsJoin(roomId);

      io.to(roomId).emit("match_found", {
        roomId,
        players: [p1.username, p2.username],
        turn: p1.username,
      });
    }
  });

  socket.on("make_move", ({ roomId, index, username }) => {
    const game = games[roomId];
    if (!game || game.board[index]) return;

    const mark = game.players[0].id === socket.id ? "X" : "O";
    if (game.turn !== socket.id) return;

    game.board[index] = mark;
    const winner = checkWinner(game.board);

    game.turn = game.turn === game.players[0].id ? game.players[1].id : game.players[0].id;

    io.to(roomId).emit("update_board", {
      board: game.board,
      nextTurn: game.players.find(p => p.id === game.turn).username,
    });

    if (winner) {
      io.to(roomId).emit("game_over", { winner });
      delete games[roomId];
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
};

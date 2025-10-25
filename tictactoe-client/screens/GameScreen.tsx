import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import Board from "../components/Board";
import { socket } from "../services/socket";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId, username } = route.params;
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<string>("");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // ✅ Reconnect player to game with identity
    socket.emit("reconnect_game", { roomId, username });

    const handleBoardUpdate = (data: { board: string[]; nextTurn: string }) => {
      setBoard(data.board);
      setTurn(data.nextTurn);
    };

    const handleGameOver = (data: { winner: string }) => {
      setWinner(data.winner);
    };

    socket.on("updateBoard", handleBoardUpdate);
    socket.on("gameOver", handleGameOver);

    // Cleanup listeners on unmount
    return () => {
      socket.off("updateBoard", handleBoardUpdate);
      socket.off("gameOver", handleGameOver);
    };
  }, [roomId, username]);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>🎮 Tic-Tac-Toe</Text>
        <Text style={styles.roomText}>Room: {roomId || "Waiting..."}</Text>
        <Text style={styles.turnText}>Turn: {turn || "Waiting..."}</Text>
      </View>

      {roomId ? (
        <View style={styles.boardContainer}>
          <Board board={board} roomId={roomId} username={username} />
        </View>
      ) : (
        <Text style={styles.waitText}>Waiting for room...</Text>
      )}

      {winner && <Text style={styles.winnerText}>🏆 Winner: {winner}</Text>}

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerCard: {
    backgroundColor: "#E8EAF6",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3F51B5",
    marginBottom: 10,
  },
  roomText: {
    fontSize: 18,
    color: "#333",
  },
  turnText: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  waitText: {
    fontSize: 18,
    color: "#777",
    marginTop: 20,
  },
  boardContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  winnerText: {
    fontSize: 22,
    marginTop: 25,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  homeButton: {
    marginTop: 30,
    backgroundColor: "#3F51B5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GameScreen;

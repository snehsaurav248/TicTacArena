import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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
    // Reconnect to the game if already exists
    socket.emit("reconnect_game", { roomId });

    socket.on("updateBoard", (data: { board: string[]; nextTurn: string }) => {
      setBoard(data.board);
      setTurn(data.nextTurn);
    });

    socket.on("gameOver", (data: { winner: string }) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off("updateBoard");
      socket.off("gameOver");
    };
  }, [roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room: {roomId || "Waiting..."}</Text>
      <Text style={styles.turnText}>Turn: {turn}</Text>

      {roomId ? (
        <Board board={board} roomId={roomId} username={username} />
      ) : (
        <Text>Waiting for room...</Text>
      )}

      {winner && <Text style={styles.winnerText}>Winner: {winner}</Text>}
      <Button title="Back to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  turnText: { fontSize: 18, marginBottom: 10 },
  winnerText: { fontSize: 22, marginTop: 20, color: "green", fontWeight: "bold" },
});

export default GameScreen;

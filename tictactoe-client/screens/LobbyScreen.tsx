import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { socket } from "../services/socket";

type Props = NativeStackScreenProps<RootStackParamList, "Lobby">;

const LobbyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username } = route.params;
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState("");

  useEffect(() => {
    socket.emit("find_match", username);

    socket.on(
      "match_found",
      (data: { roomId: string; players: string[]; turn: string }) => {
        setRoomId(data.roomId);
        setPlayers(data.players);
        setTurn(data.turn);
      }
    );

    return () => {
      socket.off("match_found");
    };
  }, [username]);

  const handleStartGame = () => {
    if (roomId) {
      navigation.navigate("Game", { roomId, username });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome, {username}!</Text>
      <Text style={styles.roomText}>Room ID: {roomId || "Waiting..."}</Text>
      {players.length > 0 && (
        <Text style={styles.playersText}>Players: {players.join(" vs ")}</Text>
      )}
      <Text style={styles.turnText}>Turn: {turn}</Text>

      <TouchableOpacity
        style={[styles.startButton, !roomId && styles.disabledButton]}
        onPress={handleStartGame}
        disabled={!roomId}
      >
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1E1E2F", // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  roomText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  playersText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  turnText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
});

export default LobbyScreen;

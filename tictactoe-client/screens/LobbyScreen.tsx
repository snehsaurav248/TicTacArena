import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
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
    // Ask server to find a match
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
      <Text style={styles.title}>Hello, {username}</Text>
      <Text style={styles.roomText}>Room ID: {roomId || "Waiting..."}</Text>
      {players.length > 0 && (
        <Text style={styles.playersText}>
          Players: {players.join(" vs ")}
        </Text>
      )}
      <Text style={styles.turnText}>Turn: {turn}</Text>
      <Button title="Start Game" onPress={handleStartGame} disabled={!roomId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  roomText: { fontSize: 18, marginBottom: 10 },
  playersText: { fontSize: 18, marginBottom: 10 },
  turnText: { fontSize: 16, marginBottom: 20 },
});

export default LobbyScreen;

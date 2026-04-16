import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { socket } from "../services/socket";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, "Lobby">;

const { width } = Dimensions.get('window');

const LobbyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username } = route.params;
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState("");

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulsingStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

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
      <Text style={styles.title}>ACCESS GRANTED</Text>
      <Text style={styles.subtitle}>Welcome, {username}</Text>

      <View style={styles.matchContainer}>
        {players.length > 0 ? (
          <View style={styles.versusContainer}>
            <View style={styles.playerCard}>
              <Text style={styles.playerText}>{players[0]}</Text>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={[styles.playerCard, styles.playerCardAlt]}>
              <Text style={styles.playerText}>{players[1]}</Text>
            </View>
          </View>
        ) : (
          <Animated.Text style={[styles.loadingText, pulsingStyle]}>
            SCANNING FOR OPPONENT...
          </Animated.Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.startButton, !roomId && styles.disabledButton]}
        onPress={handleStartGame}
        disabled={!roomId}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>ENGAGE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "#0B0C10",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 229, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 10,
    letterSpacing: 2,
    opacity: 0.8,
  },
  matchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 20,
    color: "#FF007F",
    fontWeight: "bold",
    letterSpacing: 3,
    textShadowColor: "rgba(255, 0, 127, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  versusContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  playerCard: {
    backgroundColor: '#1E1E2F',
    width: width * 0.8,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00E5FF',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  playerCardAlt: {
    borderColor: '#FF007F',
    shadowColor: '#FF007F',
  },
  playerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  vsText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 4,
  },
  startButton: {
    width: width * 0.8,
    backgroundColor: "#00E5FF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#00E5FF",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  startButtonText: {
    color: "#0B0C10",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
  },
  disabledButton: {
    backgroundColor: "#1F2833",
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default LobbyScreen;

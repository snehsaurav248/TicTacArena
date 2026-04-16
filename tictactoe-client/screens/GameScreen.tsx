import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import Board from "../components/Board";
import { socket } from "../services/socket";
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const { width } = Dimensions.get('window');

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId, username } = route.params;
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<string>("");
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

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

    return () => {
      socket.off("updateBoard", handleBoardUpdate);
      socket.off("gameOver", handleGameOver);
    };
  }, [roomId, username]);

  const isMyTurn = turn === username;

  return (
    <View style={styles.container}>
      <View style={styles.headerScoreboard}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>ROOM</Text>
          <Text style={styles.scoreValue}>{roomId || "---"}</Text>
        </View>
        <View style={[styles.scoreBox, isMyTurn && styles.activeTurnBox]}>
          <Text style={styles.scoreLabel}>TURN</Text>
          <Text style={[styles.scoreValue, isMyTurn && styles.activeTurnText]}>
            {turn === username ? 'YOURS' : turn}
          </Text>
        </View>
      </View>

      {roomId ? (
        <View style={styles.boardWrapper}>
          <Board board={board} roomId={roomId} username={username} />
        </View>
      ) : (
        <Text style={styles.waitText}>LOCATING MATCH...</Text>
      )}

      {winner && (
        <Animated.View 
          entering={ZoomIn.duration(400)} 
          exiting={ZoomOut} 
          style={styles.winnerOverlay}
        >
          <View style={styles.winnerCard}>
            <Text style={styles.winnerText}>
              {winner === 'Draw' ? 'DRAW!' : `VICTORY`}
            </Text>
            {winner !== 'Draw' && (
              <Text style={styles.winnerName}>{winner} WINS</Text>
            )}
            
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>RETURN TO BASE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {!winner && (
        <TouchableOpacity
          style={styles.abortButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <Text style={styles.abortButtonText}>ABORT MISSION</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C10",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerScoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  scoreBox: {
    backgroundColor: '#1E1E2F',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2A2A40',
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  activeTurnBox: {
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '900',
  },
  activeTurnText: {
    color: '#00E5FF',
    textShadowColor: 'rgba(0, 229, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  boardWrapper: {
    padding: 10,
    backgroundColor: '#111218',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1F2833',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  waitText: {
    fontSize: 18,
    color: "#FF007F",
    marginTop: 50,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  winnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 12, 16, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  winnerCard: {
    width: width * 0.85,
    backgroundColor: '#1E1E2F',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  winnerText: {
    fontSize: 42,
    color: '#FFD700',
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  winnerName: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  homeButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  homeButtonText: {
    color: "#0B0C10",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  abortButton: {
    marginTop: 'auto',
    marginBottom: 40,
    paddingVertical: 15,
  },
  abortButtonText: {
    color: '#F92672',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.8,
  },
});

export default GameScreen;

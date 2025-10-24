import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Board from '../components/Board';
import { socket } from '../services/socket';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId, username } = route.params;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    socket.emit('joinGame', { roomId, username });

    socket.on('updateBoard', (data: { board: string[]; turn: 'X' | 'O'; winner: string | null }) => {
      setBoard(data.board);
      setTurn(data.turn);
      setWinner(data.winner);
    });

    return () => {
      socket.off('updateBoard');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room: {roomId}</Text>
      <Text style={styles.turnText}>Turn: {turn}</Text>
      <Board board={board} roomId={roomId} username={username} />
      {winner && <Text style={styles.winnerText}>Winner: {winner}</Text>}
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  turnText: { fontSize: 18, marginBottom: 10 },
  winnerText: { fontSize: 22, marginTop: 20, color: 'green', fontWeight: 'bold' },
});

export default GameScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { socket } from '../services/socket';

type Props = NativeStackScreenProps<RootStackParamList, 'Lobby'>;

const LobbyScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username } = route.params;
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    socket.emit('joinLobby', { username });

    socket.on('roomCreated', (data: { roomId: string }) => {
      setRoomId(data.roomId);
    });

    return () => {
      socket.off('roomCreated');
    };
  }, []);

  const handleStartGame = () => {
    if (roomId) {
      navigation.navigate('Game', { roomId, username });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {username}</Text>
      <Text style={styles.roomText}>Room ID: {roomId || 'Waiting...'}</Text>
      <Button title="Start Game" onPress={handleStartGame} disabled={!roomId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  roomText: { fontSize: 18, marginBottom: 20 },
});

export default LobbyScreen;

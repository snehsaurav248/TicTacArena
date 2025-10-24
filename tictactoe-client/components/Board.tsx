import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { socket } from '../services/socket';

interface BoardProps {
  board: (string | null)[];
  roomId: string;
  username: string;
}

const Board: React.FC<BoardProps> = ({ board, roomId, username }) => {
  const handleCellPress = (index: number) => {
    socket.emit('makeMove', { roomId, index, username });
  };

  return (
    <View style={styles.board}>
      {board.map((cell, index) => (
        <Cell key={index} value={cell} onPress={() => handleCellPress(index)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Board;

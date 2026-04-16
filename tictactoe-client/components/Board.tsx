import React from "react";
import { View, StyleSheet } from "react-native";
import { socket } from "../services/socket";
import Cell from "./Cell";

type Props = {
  board: (string | null)[];
  roomId: string;
  username: string;
};

const Board: React.FC<Props> = ({ board, roomId, username }) => {
  const handlePress = (index: number) => {
    if (!board[index]) {
      socket.emit("make_move", { roomId, index, username });
    }
  };

  return (
    <View style={styles.container}>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onPress={() => handlePress(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    aspectRatio: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
    marginVertical: 20,
    backgroundColor: "transparent",
    padding: 10,
    gap: 8,
  },
});

export default Board;

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { socket } from "../services/socket";

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
        <TouchableOpacity
          key={index}
          style={styles.cell}
          onPress={() => handlePress(index)}
          disabled={!!cell}
        >
          <Text style={styles.cellText}>{cell}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 20,
  },
  cell: {
    width: "33.33%",
    height: "33.33%",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default Board;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CellProps {
  value: string | null;
  onPress: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onPress }) => {
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48,
  },
});

export default Cell;

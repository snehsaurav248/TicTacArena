import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';

interface CellProps {
  value: string | null;
  onPress: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (value) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isX = value === 'X';
  const isO = value === 'O';

  return (
    <TouchableOpacity
      style={styles.cell}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!!value}
    >
      <Animated.Text
        style={[
          styles.text,
          isX && styles.textX,
          isO && styles.textO,
          animatedStyle,
        ]}
      >
        {value}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A2A40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 52,
    fontWeight: '900',
  },
  textX: {
    color: '#00E5FF',
    textShadowColor: 'rgba(0, 229, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textO: {
    color: '#FF007F',
    textShadowColor: 'rgba(255, 0, 127, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default Cell;

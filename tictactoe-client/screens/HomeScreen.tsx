import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleStart = () => {
    if (username.trim()) {
      navigation.navigate('Lobby', { username });
    }
  };

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Tic-Tac-Toe Multiplayer</Text>

      <TextInput
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={[styles.button, !username.trim() && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!username.trim()}
      >
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

      {/* Leaderboard Button */}
      <TouchableOpacity
        style={[styles.button, styles.leaderboardButton]}
        onPress={handleLeaderboard}
      >
        <Text style={styles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#aba7c2ff',
  },
  title: { 
    fontSize: 32, 
    marginBottom: 30, 
    fontWeight: 'bold', 
    color: '#6200EE',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#6200EE',
    borderRadius: 12,
    backgroundColor: '#EDE7F6', 
  },
  input: { 
    width: '70%', 
    borderWidth: 1, 
    borderColor: '#6200EE', 
    padding: 12, 
    marginBottom: 20, 
    borderRadius: 10,
    backgroundColor: '#e3d9d9ff',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  leaderboardButton: {
    marginTop: 15, // spacing from Start button
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#100f0fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;

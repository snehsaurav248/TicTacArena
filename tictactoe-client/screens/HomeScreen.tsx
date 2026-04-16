import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

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
      <StatusBar style="light" />
      <View style={styles.titleContainer}>
        <Text style={styles.titleGlow}>NEON</Text>
        <Text style={styles.title}>TICTACTOE</Text>
      </View>

      <TextInput
        placeholder="Enter your alias..."
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#6B7280"
        maxLength={15}
      />

      <TouchableOpacity
        style={[styles.button, !username.trim() && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!username.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>INITIALIZE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.leaderboardButton]}
        onPress={handleLeaderboard}
        activeOpacity={0.8}
      >
        <Text style={styles.leaderboardButtonText}>LEADERBOARD</Text>
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
    backgroundColor: '#0B0C10',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titleGlow: {
    fontSize: 52,
    fontWeight: '900',
    color: '#00E5FF',
    textShadowColor: 'rgba(0, 229, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 4,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    letterSpacing: 8,
    marginTop: -5,
  },
  input: { 
    width: width * 0.8,
    height: 60,
    borderWidth: 2, 
    borderColor: '#1F2833', 
    paddingHorizontal: 20, 
    marginBottom: 30, 
    borderRadius: 12,
    backgroundColor: '#1E1E2F',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    width: width * 0.8,
    backgroundColor: '#00E5FF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#1F2833',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#0B0C10',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  leaderboardButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF007F',
    shadowColor: '#FF007F',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  leaderboardButtonText: {
    color: '#FF007F',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 0, 127, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

export default HomeScreen;

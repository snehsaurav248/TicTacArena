import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LobbyScreen from '../screens/LobbyScreen';
import GameScreen from '../screens/GameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

export type RootStackParamList = {
  Home: undefined;
  Lobby: { username: string };
  Game: { roomId: string; username: string };
  Leaderboard: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe Multiplayer</Text>
      <TextInput
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Button title="Start" onPress={handleStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, marginBottom: 20, fontWeight: 'bold' },
  input: { width: '100%', borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8 },
});

export default HomeScreen;

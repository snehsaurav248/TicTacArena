import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInUp } from 'react-native-reanimated';

type Player = {
  username: string;
  wins: number;
  draws: number;
  losses: number;
};

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tictactoe-server-1q86.onrender.com/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getRankColor = (index: number) => {
    if (index === 0) return '#FFD700'; // Gold
    if (index === 1) return '#C0C0C0'; // Silver
    if (index === 2) return '#CD7F32'; // Bronze
    return '#00E5FF'; // Default neon
  };

  const renderItem = ({ item, index }: { item: Player; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(400)}>
      <View style={[styles.row, { borderColor: getRankColor(index) }]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, { color: getRankColor(index) }]}>#{index + 1}</Text>
        </View>
        <Text style={styles.name}>{item.username}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statWin}>W:{item.wins}</Text>
          <Text style={styles.statDraw}>D:{item.draws}</Text>
          <Text style={styles.statLoss}>L:{item.losses}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>GLOBAL RANKINGS</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.username}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>RETURN TO BASE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60,
    backgroundColor: "#0B0C10" 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "900", 
    textAlign: "center", 
    marginBottom: 30,
    color: '#00E5FF',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 229, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    padding: 18,
    backgroundColor: "#1E1E2F",
    marginBottom: 15,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  rankContainer: {
    width: 40,
  },
  rank: { 
    fontWeight: "900", 
    fontSize: 18,
  },
  name: { 
    flex: 1,
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statWin: { fontSize: 14, fontWeight: "800", color: '#4CAF50' },
  statDraw: { fontSize: 14, fontWeight: "800", color: '#FFC107' },
  statLoss: { fontSize: 14, fontWeight: "800", color: '#F44336' },
  backButton: {
    margin: 20,
    backgroundColor: "#1F2833",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    opacity: 0.8,
  },
});

export default LeaderboardScreen;

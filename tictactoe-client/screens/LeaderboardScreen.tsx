import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type Player = {
  username: string;
  wins: number;
  draws: number;
  losses: number;
};

const LeaderboardScreen: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch("http://192.168.7.80:5000/leaderboard")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  }, []);

  const renderItem = ({ item, index }: { item: Player; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.name}>{item.username}</Text>
      <Text style={styles.stats}>
        W:{item.wins} D:{item.draws} L:{item.losses}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  rank: { fontWeight: "bold", fontSize: 16 },
  name: { fontSize: 16 },
  stats: { fontSize: 16, fontWeight: "500" },
});

export default LeaderboardScreen;

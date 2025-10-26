import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import hook

type Player = {
  username: string;
  wins: number;
  draws: number;
  losses: number;
};

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation(); // Get navigation
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch("https://tictactoe-server-1q86.onrender.com/leaderboard")
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
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅ Back</Text>
      </TouchableOpacity>
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
  backButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LeaderboardScreen;

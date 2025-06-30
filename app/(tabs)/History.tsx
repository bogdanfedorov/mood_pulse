import { DataUpdateTick, MOOD_LABELS, MoodEntry } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("mood_entries");
      setEntries(data ? JSON.parse(data) : []);
    };
    const interval = setInterval(load, DataUpdateTick);
    load();
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood History</Text>
      <FlatList
        data={entries}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleString("en-US")}
            </Text>
            <Text style={styles.emoji}>
              {MOOD_LABELS.find((mood) => mood.value === item.mood)?.emoji}
            </Text>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No entries yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  date: {
    flex: 2,
    fontSize: 14,
    color: "#888",
  },
  emoji: {
    flex: 1,
    fontSize: 24,
    textAlign: "center",
  },
  comment: {
    flex: 3,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 16,
  },
});

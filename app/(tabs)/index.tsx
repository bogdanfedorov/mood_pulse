import { MOOD_LABELS } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const saveMood = async () => {
    if (selectedMood === null) {
      Alert.alert("Please select your mood!");
      return;
    }
    setSaving(true);
    const entry = {
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      mood: selectedMood, // 1-5
      comment,
    };
    try {
      const prev = await AsyncStorage.getItem("mood_entries");
      const entries = prev ? JSON.parse(prev) : [];
      entries.unshift(entry);
      await AsyncStorage.setItem("mood_entries", JSON.stringify(entries));
      setComment("");
      setSelectedMood(null);
      Alert.alert("Saved!");
    } catch (e) {
      Alert.alert("Save error");
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.emojiRow}>
        {MOOD_LABELS.map((mood, idx) => (
          <TouchableOpacity
            key={`main:mood_selector:mood:${mood.emoji}`}
            style={[
              styles.emojiBtn,
              selectedMood === mood.value && styles.selectedEmoji,
            ]}
            onPress={() => setSelectedMood(mood.value)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Comment (optional)"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveMood}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emojiRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  emojiBtn: {
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  selectedEmoji: {
    borderColor: "#4f8cff",
    backgroundColor: "#e6f0ff",
  },
  emoji: {
    fontSize: 32,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  saveBtn: {
    backgroundColor: "#4f8cff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

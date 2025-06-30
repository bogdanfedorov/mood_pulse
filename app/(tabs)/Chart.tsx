import { DataUpdateTick, MOOD_LABELS } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

type MoodEntry = {
  date: string; // 'YYYY-MM-DD' or ISO
  mood: number; // 1-5
  comment: string;
};

type ChartData = {
  labels: string[];
  data: number[];
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
}

export default function ChartScreen() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    data: [],
  });

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem("mood_entries");
      const entries: MoodEntry[] = raw ? JSON.parse(raw) : [];

      const grouped: Record<string, number[]> = {};
      entries.forEach((entry: MoodEntry) => {
        const day = entry.date.slice(0, 10);
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(entry.mood);
      });

      const last7days: string[] = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
      });
      const labels: string[] = last7days.map(formatDate);
      const data: number[] = last7days.map((day) => {
        const moods = grouped[day];
        if (!moods || moods.length === 0) return 1;
        const avg =
          moods.reduce((a: number, b: number) => a + b, 0) / moods.length;
        return Number(avg.toFixed(2));
      });
      console.log(data);
      setChartData({ labels, data });
    };
    load();
    const interval = setInterval(load, DataUpdateTick);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mood Chart (7 days)</Text>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
            },
          ],
        }}
        width={Dimensions.get("window").width - 32}
        height={220}
        yLabelsOffset={10}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(79, 140, 255, ${opacity})`,
          labelColor: () => "#888",
          style: { borderRadius: 16 },
          propsForDots: { r: "5", strokeWidth: "2", stroke: "#4f8cff" },
        }}
        withInnerLines
        withOuterLines
        withDots
        withShadow={false}
        withVerticalLines={false}
        withHorizontalLines
        yAxisInterval={1}
        segments={4} // 5 levels (5-1)
        fromZero={false}
        bezier={false}
        yAxisLabel={""}
        yAxisSuffix={""}
        formatYLabel={(y: string) => {
          const val = Math.round(Number(y));
          const mood = MOOD_LABELS.find((m) => m.value === val);
          return mood ? `${val} ${mood.emoji}\n${mood.label}` : "";
        }}
        getDotColor={(value: number) =>
          isNaN(value) ? "transparent" : "#4f8cff"
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/History/History.styles";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";

const mockHistory = [
  {
    id: "1",
    parking: "Parqueadero Central",
    date: "10/01/2026",
    amount: "$3.00",
  },
  {
    id: "2",
    parking: "Parking Loja Norte",
    date: "08/01/2026",
    amount: "$2.50",
  },
];

export const HistoryScreen = ({ route, navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.parking}</Text>
            <Text style={styles.cardText}>{item.date}</Text>
            <Text style={styles.cardAmount}>{item.amount}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

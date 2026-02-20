import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { styles } from "../styles/home/HomeScreen.styles";

export const HomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>ParkEasy</Text>
          <Text style={styles.greeting}>Hola, Juan!</Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
          accessibilityLabel="Ir al perfil"
        >
          <Text style={styles.avatarText}>J</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cards */}
        <ActionCard
          title="Reservar"
          subtitle="Buscar y reservar un lugar"
          icon="📍"
          color="#f0b923"
          onPress={() => navigation.navigate("ParkingList")}
        />
        <ActionCard
          title="Ver reservaciones"
          subtitle=" Historial de reservaciones"
          icon="🗓️"
          color="#3B82F6"
          onPress={() => navigation.navigate("History")}
        />

        <ActionCard
          title="Vehiculos"
          subtitle="Ver vehiculos registrados"
          icon="🚘"
          color="#55c035"
          background="#0000ff"
          onPress={() => navigation.navigate("Vehicles")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const ActionCard = ({ title, subtitle, icon, color, onPress }: any) => (
  <TouchableOpacity
    style={[styles.card, { borderColor: color }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>

    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

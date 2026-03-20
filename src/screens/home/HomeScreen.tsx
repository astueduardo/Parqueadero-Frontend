// screens/home/HomeScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

// Hooks
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

// Styles
import { createHomeStyles } from "../../styles/home/HomeScreen.styles";

// Shared components (podrías mover ActionCard e InfoCard a shared/components)
import { ActionCard } from "../../shared/components/actionsCards";
import { InfoCard } from "../../shared/components/InfoCards";

export const HomeScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  // Memoizar estilos para evitar recreaciones innecesarias
  const styles = useMemo(() => createHomeStyles(colors), [colors]);

  const userName = user?.name || "Juan";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.header}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>ParkEasy</Text>
          <Text style={styles.greeting}>Hola, {userName}!</Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
          accessibilityLabel="Ir al perfil"
          activeOpacity={0.7}
        >
          <Text style={styles.avatarText}>{userInitial}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Cards principales */}
        <ActionCard
          title="Reservar"
          subtitle="Buscar y reservar un lugar"
          icon="📍"
          color={colors.warning}
          onPress={() => navigation.navigate("ParkingList")}
        />

        <ActionCard
          title="Ver reservaciones"
          subtitle="Historial de reservaciones"
          icon="🗓️"
          color={colors.info}
          onPress={() => navigation.navigate("History")}
        />

        <ActionCard
          title="Vehículos"
          subtitle="Ver vehículos registrados"
          icon="🚘"
          color={colors.vehicle}
          onPress={() => navigation.navigate("Vehicles")}
        />

      </ScrollView>
    </SafeAreaView>
  );
};
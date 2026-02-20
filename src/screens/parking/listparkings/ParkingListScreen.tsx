import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getParkings, ParkingLot } from "../../../api/parking/parkings.api";
import { styles } from "../../styles/parking/ParkingList.styles";
import { ParkingHeader } from "../listparkings/ParkingHeader";

export const ParkingListScreen = ({ navigation }: any) => {
  const [parkings, setParkings] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      const data = await getParkings();
      setParkings(data);
    } catch (error) {
      console.error("Error loading parkings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParkings = useMemo(() => {
    return parkings.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, parkings]);

  const toggleFavorite = useCallback((id: string) => {
    setParkings(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  }, []);

  // Función para calcular color según OCUPACIÓN (inverso)
  const getAvailabilityColor = (available: number, total: number) => {
    const occupiedPercent = total > 0 ? (total - available) / total : 0;
    if (occupiedPercent > 0.6) return "#EF4444"; // rojo (muy ocupado)
    if (occupiedPercent > 0.3) return "#F59E0B"; // naranja (medio ocupado)
    return "#10B981"; // verde (poco ocupado)
  };

  const renderItem = ({ item }: { item: ParkingLot }) => {
    // Calcular porcentaje de OCUPACIÓN (no disponibilidad)
    const occupiedPercent = item.total > 0 ? ((item.total - item.available) / item.total) * 100 : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("ParkingDetail", { parking: item })}
        style={styles.card}
      >
        {/* Header card */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={item.isFavorite ? "#EF4444" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        {/* Dirección */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.address}> {item.address}</Text>
        </View>

        {/* Info row - TIEMPO PRIMERO, DISTANCIA DESPUÉS */}
        <View style={styles.infoRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={14} color="#383a38" />
            <Text style={styles.infoText}> {item.etaMinutes} min</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="navigate-outline" size={14} color="#1d68e0" />
            <Text style={styles.infoText}> {item.distance} km</Text>
          </View>

          <Text style={styles.infoText}>⭐ {item.rating}</Text>

          <Text style={styles.price}>${item.price}/hora</Text>
        </View>

        {/* Disponibilidad - SEGUNDO: Texto arriba */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
          <Text
            style={[
              styles.available,
              { color: getAvailabilityColor(item.available, item.total) },
            ]}
          >
            {item.available} espacios disponibles
          </Text>
          <Text style={styles.total}>de {item.total}</Text>
        </View>

        {/* Barra de progreso - Crece de DERECHA a IZQUIERDA según ocupación */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(occupiedPercent, 100)}%`,
                backgroundColor: getAvailabilityColor(item.available, item.total),
                alignSelf: "flex-end", // Alinea la barra a la derecha
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ParkingHeader
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => console.log("Abrir filtros")}
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.count}>
        {filteredParkings.length} parqueadero{filteredParkings.length !== 1 ? "s" : ""} disponible{filteredParkings.length !== 1 ? "s" : ""}
      </Text>

      <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};
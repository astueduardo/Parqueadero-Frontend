import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ParkingSpace {
  id: string;
  number: string;
  status: "available" | "reserved" | "occupied";
  floor: number;
}

interface ParkingDetailProps {
  route: any;
  navigation: any;
}

export const ParkingDetailScreen = ({ route, navigation }: ParkingDetailProps) => {
  const { parking } = route.params;
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParkingSpaces();
  }, []);

  const loadParkingSpaces = async () => {
    // TODO: Llamar a tu API para obtener los espacios del parqueadero
    // Por ahora simulamos datos
    const mockSpaces: ParkingSpace[] = [];
    const total = parking.total || 20;

    for (let i = 1; i <= total; i++) {
      const random = Math.random();
      let status: "available" | "reserved" | "occupied";

      if (random < 0.5) status = "available"; // 50% disponibles
      else if (random < 0.8) status = "reserved"; // 30% reservados
      else status = "occupied"; // 20% ocupados

      mockSpaces.push({
        id: `space-${i}`,
        number: `A-${i}`,
        status,
        floor: 1,
      });
    }

    setSpaces(mockSpaces);
    setLoading(false);
  };

  const getSpaceColor = (status: string) => {
    switch (status) {
      case "available": return "#FFFFFF"; // Blanco
      case "reserved": return "#F59E0B"; // Amarillo
      case "occupied": return "#EF4444"; // Rojo
      default: return "#9CA3AF";
    }
  };

  const getSpaceBorderColor = (status: string, isSelected: boolean) => {
    if (isSelected) return "#2563EB"; // Azul si está seleccionado
    switch (status) {
      case "available": return "#D1D5DB";
      case "reserved": return "#F59E0B";
      case "occupied": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const handleSpaceSelect = (space: ParkingSpace) => {
    // Solo permite seleccionar espacios disponibles
    if (space.status !== "available") return;

    setSelectedSpace(space.id === selectedSpace ? null : space.id);
  };

  const handleNext = () => {
    if (!selectedSpace) return;

    const selected = spaces.find(s => s.id === selectedSpace);
    if (selected) {
      navigation.navigate("ReservationSuccess", {
        parking,
        space: selected,
      });
    }
  };

  const renderSpace = ({ item }: { item: ParkingSpace }) => {
    const isSelected = item.id === selectedSpace;
    const isDisabled = item.status !== "available";

    return (
      <TouchableOpacity
        style={{
          width: "22%",
          height: 60,
          borderRadius: 10,
          margin: "1.5%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: getSpaceColor(item.status),
          borderWidth: isSelected ? 3 : 2,
          borderColor: getSpaceBorderColor(item.status, isSelected),
          opacity: isDisabled ? 0.6 : 1,
        }}
        onPress={() => handleSpaceSelect(item)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text
          style={{
            color: item.status === "available" ? "#111827" : "#FFFFFF",
            fontWeight: isSelected ? "700" : "600",
            fontSize: 14,
          }}
        >
          {item.number}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const availableCount = spaces.filter(s => s.status === "available").length;
  const reservedCount = spaces.filter(s => s.status === "reserved").length;
  const occupiedCount = spaces.filter(s => s.status === "occupied").length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>
            {parking.name}
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            <Ionicons name="location-outline" size={14} /> {parking.address}
          </Text>
        </View>
      </View>

      <ScrollView>
        {/* Info del parqueadero */}
        <View style={{ backgroundColor: "#FFFFFF", padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
              Piso 1
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#2563EB" }}>
              ${parking.price}/hora
            </Text>
          </View>

          <Text style={{ fontSize: 13, color: "#6B7280" }}>
            Selecciona un espacio disponible para continuar
          </Text>
        </View>

        {/* Grid de espacios */}
        <View style={{ paddingHorizontal: 10 }}>
          <FlatList
            data={spaces}
            keyExtractor={(item) => item.id}
            renderItem={renderSpace}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Leyenda */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "#FFFFFF",
            padding: 14,
            marginTop: 12,
            marginHorizontal: 16,
            borderRadius: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#D1D5DB" }} />
            <Text style={{ fontSize: 12, color: "#374151" }}>Disponible ({availableCount})</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#F59E0B" }} />
            <Text style={{ fontSize: 12, color: "#374151" }}>Reservado ({reservedCount})</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#EF4444" }} />
            <Text style={{ fontSize: 12, color: "#374151" }}>Ocupado ({occupiedCount})</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón Siguiente */}
      <View style={{ padding: 16, backgroundColor: "#FFFFFF" }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedSpace ? "#2563EB" : "#9CA3AF",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
          onPress={() => {
            if (!selectedSpace) return;

            const selected = spaces.find(s => s.id === selectedSpace);
            if (!selected) return;

            navigation.navigate("ReservationForm", {
              parking,
              space: selected,
            });
          }}
          disabled={!selectedSpace}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            {selectedSpace ? "Siguiente" : "Selecciona un espacio"}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};
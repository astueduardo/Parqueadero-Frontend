import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getParkingAvailability,
  startAvailabilityPolling,
  checkSpaceAvailable,
  ParkingSpace,
  ParkingAvailability,
} from "../../../api/parking/parking-space";
import { SafeAreaView } from "react-native-safe-area-context";

interface ParkingDetailProps {
  route: any;
  navigation: any;
}

export const ParkingDetailScreen = ({ route, navigation }: ParkingDetailProps) => {
  const { parking } = route.params;

  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    if (loading) return;
    const stopPolling = startAvailabilityPolling(
      parking.id,
      (data: ParkingAvailability) => setSpaces(data.spaces),
      (error: any) => { },
      5000
    );
    return () => stopPolling();
  }, [loading, parking.id]);

  useEffect(() => {
    if (!selectedSpace || spaces.length === 0) return;
    const space = spaces.find((s) => s.id === selectedSpace);
    if (space && space.status !== "available") {
      setSelectedSpace(null);
      Alert.alert(
        "Espacio no disponible",
        "El espacio que seleccionaste acaba de ser reservado. Por favor elige otro.",
        [{ text: "Entendido" }]
      );
    }
  }, [spaces]);

  const loadSpaces = async () => {
    try {
      const data = await getParkingAvailability(parking.id);
      setSpaces(data.spaces);
    } catch (error: any) {
      Alert.alert("Error", "No se pudieron cargar los espacios.");

    } finally {
      setLoading(false);
    }
  };

  const handleSpaceSelect = useCallback((space: ParkingSpace) => {
    if (space.status !== "available") return;
    setSelectedSpace((prev) => (prev === space.id ? null : space.id));
  }, []);

  const handleNext = async () => {
    if (!selectedSpace || confirming) return;
    const selected = spaces.find((s) => s.id === selectedSpace);
    if (!selected) return;

    setConfirming(true);
    try {
      const isAvailable = await checkSpaceAvailable(selected.id);
      if (!isAvailable) {
        setSelectedSpace(null);
        const updated = await getParkingAvailability(parking.id);
        setSpaces(updated.spaces);
        Alert.alert(
          "Espacio ocupado",
          "Este espacio acaba de ser tomado por otro usuario. Por favor elige otro.",
          [{ text: "Entendido" }]
        );
        return;
      }
      navigation.navigate("ReservationForm", { parking, space: selected });
    } catch (error) {
      Alert.alert("Error", "No se pudo verificar la disponibilidad. Intenta nuevamente.");
    } finally {
      setConfirming(false);
    }
  };

  const getSpaceColor = (status: string) => {
    switch (status) {
      case "available": return "#FFFFFF";
      case "reserved": return "#F59E0B";
      case "occupied": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const getSpaceBorderColor = (status: string, isSelected: boolean) => {
    if (isSelected) return "#2563EB";
    switch (status) {
      case "available": return "#D1D5DB";
      case "reserved": return "#F59E0B";
      case "occupied": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const renderSpace = ({ item }: { item: ParkingSpace }) => {
    const isSelected = item.id === selectedSpace;
    const isDisabled = item.status !== "available";
    return (
      <TouchableOpacity
        style={{
          width: "22%", height: 60, borderRadius: 10, margin: "1.5%",
          justifyContent: "center", alignItems: "center",
          backgroundColor: getSpaceColor(item.status),
          borderWidth: isSelected ? 3 : 2,
          borderColor: getSpaceBorderColor(item.status, isSelected),
          opacity: isDisabled ? 0.6 : 1,
        }}
        onPress={() => handleSpaceSelect(item)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text style={{
          color: item.status === "available" ? "#111827" : "#FFFFFF",
          fontWeight: isSelected ? "700" : "600",
          fontSize: 13,
        }}>
          {item.code}
        </Text>
        {item.floor > 1 && (
          <Text style={{ fontSize: 10, color: item.status === "available" ? "#6B7280" : "#FFFFFF" }}>
            P{item.floor}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12, color: "#6B7280" }}>Cargando espacios...</Text>
      </View>
    );
  }

  const availableCount = spaces.filter((s) => s.status === "available").length;
  const reservedCount = spaces.filter((s) => s.status === "reserved").length;
  const occupiedCount = spaces.filter((s) => s.status === "occupied").length;
  const floors = [...new Set(spaces.map((s) => s.floor))].sort();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>
            {parking.name}
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            {parking.address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981", marginBottom: 2 }} />
            <Text style={{ fontSize: 10, color: "#10B981" }}>En vivo</Text>
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={{ backgroundColor: "#FFFFFF", padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>
                <Text>Selecciona un espacio</Text>
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="car-outline" size={14} color="#10B981" />
                  <Text style={{ fontSize: 12, color: "#10B981", fontWeight: "600" }}>
                    {availableCount} disponibles
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="people-outline" size={14} color="#6B7280" />
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    {spaces.length} totales
                  </Text>
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#2563EB" }}>
              ${Number(parking.price).toFixed(2)}
              <Text style={{ fontSize: 12, fontWeight: "400", color: "#6B7280" }}>/hora</Text>
            </Text>
          </View>
        </View>

        {floors.map((floor) => {
          const floorSpaces = spaces.filter((s) => s.floor === floor);
          return (
            <View key={floor} style={{ marginBottom: 8 }}>
              {floors.length > 1 && (
                <Text style={{
                  fontSize: 13, fontWeight: "600", color: "#374151",
                  paddingHorizontal: 16, paddingVertical: 8,
                }}>
                  Piso {floor}
                </Text>
              )}
              <View style={{ paddingHorizontal: 10 }}>
                <FlatList
                  data={floorSpaces}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSpace}
                  numColumns={4}
                  scrollEnabled={false}
                />
              </View>
            </View>
          );
        })}

        <View style={{
          flexDirection: "row", justifyContent: "space-around",
          backgroundColor: "#FFFFFF", padding: 14,
          marginTop: 8, marginHorizontal: 16, borderRadius: 12, marginBottom: 16,
        }}>
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

      <View style={{ padding: 16, backgroundColor: "#FFFFFF" }}>
        {selectedSpace && (
          <Text style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
            <Text>Espacio seleccionado: {spaces.find((s) => s.id === selectedSpace)?.code}</Text>
          </Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: selectedSpace && !confirming ? "#2563EB" : "#9CA3AF",
            paddingVertical: 14, borderRadius: 14, alignItems: "center",
            flexDirection: "row", justifyContent: "center", gap: 8,
          }}
          onPress={handleNext}
          disabled={!selectedSpace || confirming}
          activeOpacity={0.8}
        >
          {confirming ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
                <Text>Verificando...</Text>
              </Text>
            </>
          ) : (
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
              {selectedSpace ? "Siguiente →" : "Selecciona un espacio"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
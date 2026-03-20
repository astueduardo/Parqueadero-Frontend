// screens/owner/OwnerParkingDetailScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getParkingLotById, ParkingLot } from "../../../api/parking/parkings.api";
import { getParkingAvailability, ParkingAvailability } from "../../../api/parking/parking-space";
import { openGoogleMaps } from "../../../shared/utils/navegation";
import { useAuth } from "../../../hooks/useAuth";

export const OwnerParkingDetailScreen = ({ route, navigation }: any) => {
  const { parkingId } = route.params;
  const [lot, setLot] = useState<ParkingLot | null>(null);
  const [availability, setAvailability] = useState<ParkingAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // asumiendo que tienes un hook useAuth
  const isOwner = lot?.ownerId === user?.id;
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [lotData, availData] = await Promise.all([
        getParkingLotById(parkingId),
        getParkingAvailability(parkingId),
      ]);
      setLot(lotData);
      setAvailability(availData);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el parqueadero");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [parkingId]);

  useFocusEffect(useCallback(() => { load(); }, []));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!lot) return null;

  const occupancyPct = lot.totalSpaces > 0
    ? Math.round(((lot.totalSpaces - lot.availableSpaces) / lot.totalSpaces) * 100)
    : 0;

  const occupancyColor = occupancyPct >= 90 ? "#EF4444" : occupancyPct >= 70 ? "#F59E0B" : "#10B981";

  const StatBox = ({ label, value, color }: any) => (
    <View style={{
      flex: 1, backgroundColor: "#FFF", borderRadius: 12, padding: 14,
      alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6",
    }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color }}>{value}</Text>
      <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 3, textAlign: "center" }}>{label}</Text>
    </View>
  );

  const InfoRow = ({ icon, label, value }: any) => (
    <View style={{
      flexDirection: "row", alignItems: "center",
      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
    }}>
      <View style={{ width: 32, alignItems: "center" }}>
        <Ionicons name={icon} size={16} color="#6B7280" />
      </View>
      <Text style={{ flex: 1, fontSize: 13, color: "#6B7280" }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827", maxWidth: "55%", textAlign: "right" }}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }} numberOfLines={1}>
            {lot.name}
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>
            {lot.address}
          </Text>
        </View>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
          backgroundColor: lot.isActive ? "#ECFDF5" : "#FEF2F2",
        }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: lot.isActive ? "#10B981" : "#EF4444" }}>
            {lot.isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>

        {/* Ocupación */}
        <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>Ocupación actual</Text>
            <Text style={{ fontSize: 20, fontWeight: "800", color: occupancyColor }}>{occupancyPct}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
            <View style={{ height: 8, borderRadius: 4, width: `${occupancyPct}%`, backgroundColor: occupancyColor }} />
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatBox label="Total" value={lot.totalSpaces} color="#374151" />
          <StatBox label="Disponibles" value={availability?.availableCount ?? lot.availableSpaces} color="#10B981" />
          <StatBox label="Reservados" value={availability?.reservedCount ?? 0} color="#F59E0B" />
          <StatBox label="Ocupados" value={availability?.occupiedCount ?? 0} color="#EF4444" />
        </View>

        {/* Info */}
        <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
            Información
          </Text>
          <InfoRow icon="location-outline" label="Dirección" value={lot.address} />
          {lot.price && <InfoRow icon="cash-outline" label="Precio por hora" value={`$${Number(lot.price).toFixed(2)}`} />}
          {lot.rating && <InfoRow icon="star-outline" label="Calificación" value={`${lot.rating} / 5`} />}
          {lot.latitude && lot.longitude && (
            <InfoRow
              icon="navigate-outline"
              label="Coordenadas"
              value={`${Number(lot.latitude).toFixed(4)}, ${Number(lot.longitude).toFixed(4)}`}
            />
          )}
          <InfoRow
            icon="time-outline"
            label="Creado"
            value={new Date(lot.createdAt).toLocaleDateString("es-EC")}
          />
        </View>

        {/* Acciones */}
        {isOwner && (
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#2563EB", borderRadius: 12, padding: 14,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onPress={() => navigation.navigate("OwnerSpaces", { parking: lot })}
            >
              <Ionicons name="grid-outline" size={18} color="#FFF" />
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 15 }}>
                Gestionar espacios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#F3F4F6", borderRadius: 12, padding: 14,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onPress={() => navigation.navigate("OwnerEditParking", { parking: lot })}
            >
              <Ionicons name="pencil-outline" size={18} color="#374151" />
              <Text style={{ color: "#374151", fontWeight: "700", fontSize: 15 }}>
                Editar parqueadero
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* El botón de Google Maps puede mostrarse siempre, no requiere ser owner */}
        {lot.latitude && lot.longitude && (
          <TouchableOpacity
            style={{
              backgroundColor: "#ECFDF5", borderRadius: 12, padding: 14,
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            onPress={() => openGoogleMaps(lot.latitude!, lot.longitude!)}
          >
            <Ionicons name="navigate-outline" size={18} color="#10B981" />
            <Text style={{ color: "#10B981", fontWeight: "700", fontSize: 15 }}>
              Ver en Google Maps
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};
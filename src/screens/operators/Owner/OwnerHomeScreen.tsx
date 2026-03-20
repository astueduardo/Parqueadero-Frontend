// screens/owner/OwnerHomeScreen.tsx
import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import {
    getMyParkingLots,
    deleteParkingLot,
    ParkingLot,
} from "../../../api/parking/parkings.api";
import { SafeAreaView } from "react-native-safe-area-context";
export const OwnerHomeScreen = ({ navigation }: any) => {
    const { user, logout } = useAuth();
    const [lots, setLots] = useState<ParkingLot[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadLots = useCallback(async () => {
        try {
            const data = await getMyParkingLots();
            setLots(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando parqueaderos:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadLots();
        }, [])
    );

    const handleDelete = (lot: ParkingLot) => {
        Alert.alert(
            "Eliminar parqueadero",
            `¿Estás seguro de eliminar "${lot.name}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteParkingLot(lot.id);
                            setLots(prev => prev.filter(l => l.id !== lot.id));
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el parqueadero");
                        }
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert("Cerrar sesión", "¿Deseas cerrar sesión?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Salir", style: "destructive", onPress: logout },
        ]);
    };

    const totalSpaces = lots.reduce((a, l) => a + (l.totalSpaces || 0), 0);
    const availableSpaces = lots.reduce((a, l) => a + (l.availableSpaces || 0), 0);
    const activeLots = lots.filter(l => l.isActive).length;

    const renderLot = ({ item }: { item: ParkingLot }) => {
        const occupancyPct = item.totalSpaces > 0
            ? Math.round(((item.totalSpaces - item.availableSpaces) / item.totalSpaces) * 100)
            : 0;

        const statusColor = item.availableSpaces > 0 ? "#10B981" : "#EF4444";

        return (
            <View style={{
                backgroundColor: "#FFF",
                borderRadius: 14,
                padding: 16,
                marginHorizontal: 16,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#F3F4F6",
            }}>
                {/* Barra de ocupación */}
                <View style={{ height: 3, backgroundColor: "#F3F4F6", borderRadius: 2, marginBottom: 12 }}>
                    <View style={{
                        height: 3, borderRadius: 2,
                        width: `${occupancyPct}%`,
                        backgroundColor: occupancyPct >= 90 ? "#EF4444" : occupancyPct >= 70 ? "#F59E0B" : "#10B981",
                    }} />
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 2 }}>
                            {item.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>
                            {item.address}
                        </Text>
                    </View>
                    <View style={{
                        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
                        backgroundColor: item.isActive ? "#ECFDF5" : "#FEF2F2",
                    }}>
                        <Text style={{ fontSize: 11, fontWeight: "600", color: item.isActive ? "#10B981" : "#EF4444" }}>
                            {item.isActive ? "Activo" : "Inactivo"}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: "row", gap: 16, marginBottom: 14 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="car-outline" size={14} color="#6B7280" />
                        <Text style={{ fontSize: 12, color: "#374151" }}>
                            {item.availableSpaces}/{item.totalSpaces} libres
                        </Text>
                    </View>
                    {item.price && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Ionicons name="cash-outline" size={14} color="#6B7280" />
                            <Text style={{ fontSize: 12, color: "#374151" }}>${Number(item.price).toFixed(2)}/h</Text>
                        </View>
                    )}
                    {item.rating && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Ionicons name="star" size={14} color="#FBBF24" />
                            <Text style={{ fontSize: 12, color: "#374151" }}>{item.rating}</Text>
                        </View>
                    )}
                </View>

                {/* Acciones */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "#2563EB", borderRadius: 8, padding: 10, alignItems: "center" }}
                        onPress={() => navigation.navigate("OwnerSpaces", { parking: item })}
                    >
                        <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 13 }}>Gestionar espacios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: "#F3F4F6", borderRadius: 8, padding: 10, alignItems: "center", justifyContent: "center" }}
                        onPress={() => navigation.navigate("OwnerEditParking", { parking: item })}
                    >
                        <Ionicons name="pencil-outline" size={18} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: "#FEF2F2", borderRadius: 8, padding: 10, alignItems: "center", justifyContent: "center" }}
                        onPress={() => handleDelete(item)}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingHorizontal: 16, paddingVertical: 14,
                backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
            }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>Mis Parqueaderos</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>Hola, {user?.name?.split(" ")[0]}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#2563EB", borderRadius: 10, padding: 10 }}
                        onPress={() => navigation.navigate("OwnerCreateParking")}
                    >
                        <Ionicons name="add" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: "#F3F4F6", borderRadius: 10, padding: 10 }}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: "row", padding: 16, gap: 10 }}>
                {[
                    { label: "Parqueaderos", value: lots.length, color: "#2563EB" },
                    { label: "Activos", value: activeLots, color: "#10B981" },
                    { label: "Espacios", value: totalSpaces, color: "#6B7280" },
                    { label: "Disponibles", value: availableSpaces, color: "#F59E0B" },
                ].map(({ label, value, color }) => (
                    <View key={label} style={{ flex: 1, backgroundColor: "#FFF", borderRadius: 10, padding: 10, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color }}>{value}</Text>
                        <Text style={{ fontSize: 10, color: "#6B7280", textAlign: "center", marginTop: 2 }}>{label}</Text>
                    </View>
                ))}
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : lots.length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
                    <Ionicons name="business-outline" size={64} color="#D1D5DB" />
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 16 }}>
                        Sin parqueaderos
                    </Text>
                    <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>
                        Crea tu primer parqueadero para comenzar
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: "#2563EB", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 }}
                        onPress={() => navigation.navigate("OwnerCreateParking")}
                    >
                        <Text style={{ color: "#FFF", fontWeight: "600" }}>Crear parqueadero</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={lots}
                    keyExtractor={item => item.id}
                    renderItem={renderLot}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadLots(); }} />}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
                />
            )}
        </SafeAreaView>
    );
};
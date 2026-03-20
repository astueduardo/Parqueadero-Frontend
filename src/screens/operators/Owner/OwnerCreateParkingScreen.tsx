// screens/owner/OwnerCreateParkingScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createParkingLot } from "../../../api/parking/parkings.api";

// ── Estilo reutilizable fuera del componente ──
const inputStyle = {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    fontSize: 14,
    color: "#111827",
} as const;

const labelStyle = {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: "600" as const,
};

export const OwnerCreateParkingScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        address: "",
        totalSpaces: "",
        availableSpaces: "",
        price: "",
        latitude: "",
        longitude: "",
        isActive: false,
    });

    const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

    const validate = () => {
        if (!form.name.trim()) { Alert.alert("Error", "El nombre es requerido"); return false; }
        if (!form.address.trim()) { Alert.alert("Error", "La dirección es requerida"); return false; }
        if (!form.totalSpaces || isNaN(Number(form.totalSpaces)) || Number(form.totalSpaces) < 1) {
            Alert.alert("Error", "Los espacios totales deben ser mayor a 0"); return false;
        }
        if (!form.availableSpaces || isNaN(Number(form.availableSpaces))) {
            Alert.alert("Error", "Los espacios disponibles son requeridos"); return false;
        }
        if (Number(form.availableSpaces) > Number(form.totalSpaces)) {
            Alert.alert("Error", "Los espacios disponibles no pueden superar el total"); return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await createParkingLot({
                name: form.name.trim(),
                address: form.address.trim(),
                totalSpaces: Number(form.totalSpaces),
                availableSpaces: Number(form.availableSpaces),
                price: form.price ? Number(form.price) : undefined,
                latitude: form.latitude ? Number(form.latitude) : undefined,
                longitude: form.longitude ? Number(form.longitude) : undefined,
            });
            Alert.alert("¡Éxito!", "Parqueadero creado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo crear el parqueadero");
        } finally {
            setLoading(false);
        }
    };

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
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                    Nuevo Parqueadero
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>

                {/* Info básica */}
                <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
                        Información básica
                    </Text>

                    <View>
                        <Text style={labelStyle}>Nombre *</Text>
                        <TextInput
                            style={inputStyle}
                            placeholder="Ej: Parqueadero Central Norte"
                            placeholderTextColor="#9CA3AF"
                            value={form.name}
                            onChangeText={v => set("name", v)}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>Dirección *</Text>
                        <TextInput
                            style={inputStyle}
                            placeholder="Ej: Av. Principal 123, Loja"
                            placeholderTextColor="#9CA3AF"
                            value={form.address}
                            onChangeText={v => set("address", v)}
                        />
                    </View>

                    <View>
                        <Text style={labelStyle}>Precio por hora (USD)</Text>
                        <TextInput
                            style={inputStyle}
                            placeholder="Ej: 1.50"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="decimal-pad"
                            value={form.price}
                            onChangeText={v => set("price", v)}
                        />
                    </View>
                </View>

                {/* Capacidad */}
                <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
                        Capacidad
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>Espacios totales *</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="Ej: 20"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                value={form.totalSpaces}
                                onChangeText={v => set("totalSpaces", v)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>Disponibles *</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="Ej: 20"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                value={form.availableSpaces}
                                onChangeText={v => set("availableSpaces", v)}
                            />
                        </View>
                    </View>
                </View>

                {/* Coordenadas */}
                <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
                        Coordenadas (opcional)
                    </Text>
                    <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: -8 }}>
                        Necesarias para mostrar la ruta en Google Maps
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>Latitud</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="-3.9931"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="decimal-pad"
                                value={form.latitude}
                                onChangeText={v => set("latitude", v)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle}>Longitud</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="-79.2042"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="decimal-pad"
                                value={form.longitude}
                                onChangeText={v => set("longitude", v)}
                            />
                        </View>
                    </View>
                </View>

                {/* Estado */}
                <View style={{
                    backgroundColor: "#FFF", borderRadius: 12, padding: 16,
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                }}>
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
                            Parqueadero activo
                        </Text>
                        <Text style={{ fontSize: 12, color: form.isActive ? "#10B981" : "#9CA3AF", marginTop: 2 }}>
                            {form.isActive
                                ? "Visible para los usuarios"
                                : "Actívalo cuando esté listo para recibir reservas"}
                        </Text>
                    </View>
                    <Switch
                        value={form.isActive}
                        onValueChange={v => set("isActive", v)}
                        trackColor={{ false: "#E5E7EB", true: "#BFDBFE" }}
                        thumbColor={form.isActive ? "#2563EB" : "#9CA3AF"}
                    />
                </View>

            </ScrollView>

            {/* Botón */}
            <View style={{ padding: 16, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: loading ? "#9CA3AF" : "#2563EB",
                        borderRadius: 12, padding: 16, alignItems: "center",
                        flexDirection: "row", justifyContent: "center", gap: 8,
                    }}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFF" size="small" />
                        : <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                    }
                    <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>
                        {loading ? "Creando..." : "Crear parqueadero"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
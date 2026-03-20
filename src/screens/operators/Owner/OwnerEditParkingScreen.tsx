// screens/owner/OwnerEditParkingScreen.tsx
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
import { updateParkingLot } from "../../../api/parking/parkings.api";


const InputField = ({ label, placeholder, value, onChangeText, keyboardType = "default", required = false }: any) => (
    <View>
        <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: "600" }}>
            {label} {required && "*"}
        </Text>
        <TextInput
            style={{
                backgroundColor: "#F9FAFB", borderRadius: 8, borderWidth: 1,
                borderColor: "#E5E7EB", padding: 12, fontSize: 14, color: "#111827",
            }}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

export const OwnerEditParkingScreen = ({ route, navigation }: any) => {
    const { parking } = route.params;

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: parking.name || "",
        address: parking.address || "",
        totalSpaces: String(parking.totalSpaces || ""),
        availableSpaces: String(parking.availableSpaces || ""),
        price: parking.price ? String(parking.price) : "",
        latitude: parking.latitude ? String(parking.latitude) : "",
        longitude: parking.longitude ? String(parking.longitude) : "",
        isActive: parking.isActive ?? true,
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

    const handleUpdate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await updateParkingLot(parking.id, {
                name: form.name.trim(),
                address: form.address.trim(),
                totalSpaces: Number(form.totalSpaces),
                availableSpaces: Number(form.availableSpaces),
                price: form.price ? Number(form.price) : undefined,
                latitude: form.latitude ? Number(form.latitude) : undefined,
                longitude: form.longitude ? Number(form.longitude) : undefined,
                isActive: form.isActive,
            });
            Alert.alert("¡Éxito!", "Parqueadero actualizado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo actualizar el parqueadero");
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
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                        Editar Parqueadero
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>{parking.name}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>

                {/* Info básica */}
                <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
                        Información básica
                    </Text>
                    <InputField
                        label="Nombre" required
                        placeholder="Ej: Parqueadero Central Norte"
                        value={form.name}
                        onChangeText={(v: string) => set("name", v)}
                    />
                    <InputField
                        label="Dirección" required
                        placeholder="Ej: Av. Principal 123, Loja"
                        value={form.address}
                        onChangeText={(v: string) => set("address", v)}
                    />
                    <InputField
                        label="Precio por hora (USD)"
                        placeholder="Ej: 1.50"
                        keyboardType="decimal-pad"
                        value={form.price}
                        onChangeText={(v: string) => set("price", v)}
                    />
                </View>

                {/* Capacidad */}
                <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, gap: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 }}>
                        Capacidad
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="Espacios totales" required
                                placeholder="Ej: 20"
                                keyboardType="numeric"
                                value={form.totalSpaces}
                                onChangeText={(v: string) => set("totalSpaces", v)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="Disponibles" required
                                placeholder="Ej: 20"
                                keyboardType="numeric"
                                value={form.availableSpaces}
                                onChangeText={(v: string) => set("availableSpaces", v)}
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
                            <InputField
                                label="Latitud"
                                placeholder="-3.9931"
                                keyboardType="decimal-pad"
                                value={form.latitude}
                                onChangeText={(v: string) => set("latitude", v)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="Longitud"
                                placeholder="-79.2042"
                                keyboardType="decimal-pad"
                                value={form.longitude}
                                onChangeText={(v: string) => set("longitude", v)}
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
                        <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                            Visible para los usuarios
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
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFF" size="small" />
                        : <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                    }
                    <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
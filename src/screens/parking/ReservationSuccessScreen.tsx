import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from "react-native-safe-area-context";

interface ReservationSuccessProps {
    route: any;
    navigation: any;
}

export const ReservationSuccessScreen = ({ route, navigation }: ReservationSuccessProps) => {
    const { reservation, parking, space, total, arrivalTime, departureTime } = route.params;
    const [loading, setLoading] = useState(false);

    const handleShareReservation = async () => {
        try {
            const message = `
Reserva confirmada ✅
━━━━━━━━━━━━━━━━━━━━━
🅿️ Parqueadero: ${parking.name}
📍 Dirección: ${parking.address}
🚗 Espacio: ${space.code}
⏰ Llegada: ${arrivalTime}
🚫 Salida: ${departureTime}
💵 Total: $${Number(total)}
🎫 Código: ${reservation.qr_code}
━━━━━━━━━━━━━━━━━━━━━
            `.trim();

            await Share.share({
                message,
                title: "Mi reserva de parqueadero",
            });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo compartir");
        }
    };

    const handleCopyCode = async () => {
        try {
            // En React Native se usa un método nativo; simplemente notificamos
            Alert.alert(
                "Código",
                `Código de reserva: ${reservation.qr_code}`,
                [{ text: "Cerrar" }]
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleGoHome = () => {
        navigation.navigate("Home");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
                {/* Checkmark de éxito */}
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: "#10B981",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 12 }}>
                        ¡Reserva confirmada!
                    </Text>
                    <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                        <Text>Tu estacionamiento está reservado</Text>
                    </Text>
                </View>

                {/* Detalles */}
                <View style={{ marginHorizontal: 16, backgroundColor: "#FFF", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
                        <Text>Detalles de la reserva</Text>
                    </Text>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 8 }}>
                        <Text style={{ color: "#6B7280", fontSize: 12 }}>Parqueadero</Text>
                        <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
                            {parking.name}
                        </Text>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 8 }}>
                        <Text style={{ color: "#6B7280", fontSize: 12 }}>Dirección</Text>
                        <Text style={{ fontSize: 14, color: "#374151" }}>{parking.address}</Text>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 8 }}>
                        <Text style={{ color: "#6B7280", fontSize: 12 }}>Espacio</Text>
                        <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
                            {space.code}
                        </Text>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 8 }}>
                        <Text style={{ color: "#6B7280", fontSize: 12 }}>Horario</Text>
                        <Text style={{ fontSize: 14, color: "#374151" }}>
                            {arrivalTime} → {departureTime}
                        </Text>
                    </View>

                    <View style={{ paddingVertical: 8 }}>
                        <Text style={{ color: "#6B7280", fontSize: 12 }}>Total</Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#2563EB" }}>
                            ${Number(total).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* QR Code */}
                {reservation.qr_code ? (
                    <View style={{ marginHorizontal: 16, backgroundColor: "#FFF", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 16 }}>
                            <Text>Código QR de entrada</Text>
                        </Text>
                        <QRCode
                            value={reservation.qr_code}
                            size={200}
                            color="#111827"
                            backgroundColor="#FFFFFF"
                        />
                        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 12, textAlign: "center" }}>
                            <Text>Muestra este código al llegar al parqueadero</Text>
                        </Text>
                    </View>
                ) : (
                    <View style={{ marginHorizontal: 16, backgroundColor: "#FFF", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 16 }}>
                        <Ionicons name="qr-code" size={80} color="#D1D5DB" />
                        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                            <Text>Código QR no disponible</Text>
                        </Text>
                    </View>
                )
                }

                {/* Información del código */}
                <View style={{ marginHorizontal: 16, backgroundColor: "#FFF", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
                        <Text>Código de reserva</Text>
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#111827",
                                fontFamily: "monospace",
                            }}
                        >
                            {reservation.qr_code}
                        </Text>
                        <TouchableOpacity onPress={handleCopyCode}>
                            <Ionicons name="copy" size={20} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Acciones */}
                <View style={{ marginHorizontal: 16, gap: 12 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#2563EB",
                            paddingVertical: 14,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                        onPress={handleShareReservation}
                    >
                        <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 16 }}>
                            <Text>Compartir reserva</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#E5E7EB",
                            paddingVertical: 14,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                        onPress={handleGoHome}
                    >
                        <Text style={{ color: "#111827", fontWeight: "600", fontSize: 16 }}>
                            <Text>Volver al inicio</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

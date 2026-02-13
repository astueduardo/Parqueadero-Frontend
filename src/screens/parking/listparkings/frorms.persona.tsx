import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/parking/Forms.reservation.styles";
import { createReservation } from "../../../api/reservation/reservations.api";

interface ReservationFormProps {
    route: any;
    navigation: any;
}

export const ReservationFormScreen = ({ route, navigation }: ReservationFormProps) => {
    const { parking, space } = route.params;

    const [hours, setHours] = useState(1);
    const [loading, setLoading] = useState(false);

    const pricePerHour = parking.price || 3;
    const total = pricePerHour * hours;

    const handleConfirm = async () => {
        try {
            setLoading(true);

            const startTime = new Date();
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + hours);

            const reservation = await createReservation({
                space_id: space.id, // UUID del espacio
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
            });

            navigation.replace("ReservationSuccess", {
                reservation,
                parking,
                space,
                total,
            });

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo crear la reserva");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmar reserva</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Detalle */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Detalle del parqueadero</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Parqueadero</Text>
                        <Text style={styles.value}>{parking.name}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Dirección</Text>
                        <Text style={styles.value}>{parking.address}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Espacio</Text>
                        <Text style={styles.value}>{space.number}</Text>
                    </View>
                </View>

                {/* Tiempo */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Tiempo de uso</Text>

                    <View style={styles.timeRow}>
                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setHours(Math.max(1, hours - 1))}
                        >
                            <Ionicons name="remove" size={20} color="#2563EB" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.timeInput}
                            keyboardType="numeric"
                            value={hours.toString()}
                            onChangeText={(text) =>
                                setHours(Number(text) > 0 ? Number(text) : 1)
                            }
                        />

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setHours(hours + 1)}
                        >
                            <Ionicons name="add" size={20} color="#2563EB" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.helperText}>Horas reservadas</Text>
                </View>

                {/* Resumen */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Resumen de pago</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Precio por hora</Text>
                        <Text style={styles.value}>${pricePerHour.toFixed(2)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Horas</Text>
                        <Text style={styles.value}>{hours}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botón */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirm}
                    disabled={loading}
                >
                    <Text style={styles.confirmText}>
                        {loading ? "Procesando..." : "Confirmar reserva"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

import React, { useState, useEffect } from "react";
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

import { styles } from "../../screens/styles/parking/Forms.reservation.styles";
import { createReservation } from "../../api/reservation/reservations.api";
import { getMyVehicles, Vehicle } from '../../api/vehiculo/vehicles.api';

interface ReservationFormProps {
    route: any;
    navigation: any;
}

export const ReservationFormScreen = ({ route, navigation }: ReservationFormProps) => {
    const { parking, space } = route.params;

    const [durationHours, setDurationHours] = useState(1);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [arrivalHours, setArrivalHours] = useState(14); // 14:00 default
    const [arrivalMinutes, setArrivalMinutes] = useState(0);

    const pricePerHour = parking.price || 3;
    const total = pricePerHour * durationHours;

    // Format arrival time and calculate departure
    const formatTime = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const arrivalTimeStr = formatTime(arrivalHours, arrivalMinutes);

    const computeDepartureTime = (h: number, m: number, dur: number) => {
        let newH = h + dur;
        if (newH >= 24) newH -= 24;
        return formatTime(newH, m);
    };

    const departureTimeStr = computeDepartureTime(arrivalHours, arrivalMinutes, durationHours);

    const handleConfirm = async () => {
        try {
            setLoading(true);

            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), arrivalHours, arrivalMinutes);

            let endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + durationHours);

            const payload = {
                space_id: space.id,
                start_time: startDate.toISOString().slice(0, 19),
                end_time: endDate.toISOString().slice(0, 19),

                vehicle_id: selectedVehicleId || undefined,
            };
            if (!selectedVehicleId) {
                Alert.alert("Selecciona un vehículo");
                return;
            }


            console.log("[ReservationForm] Payload enviado:", JSON.stringify(payload, null, 2));

            const reservation = await createReservation(payload);

            console.log("[ReservationForm] Reservation response:", reservation);

            navigation.replace("ReservationSuccess", {
                reservation: {
                    ...reservation,
                    // asegurar campos esperados por la pantalla de éxito
                    qr_code: reservation.qr_code || reservation.id || null,
                    qr_image_url: reservation.qr_image || null,
                },
                parking,
                space,
                total,
                arrivalTime: arrivalTimeStr,
                departureTime: departureTimeStr,
            });

        } catch (error: any) {
            console.error("[ReservationForm] Error detallado:", error);
            Alert.alert("Error", `No se pudo crear la reserva: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Load vehicles and set default selection
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const v = await getMyVehicles();
                if (!mounted) return;
                setVehicles(v || []);
                if (v && v.length > 0) {
                    setSelectedVehicleId(prev => prev || v[0].vehicle_id);
                }
            } catch (err) {
                console.warn('Error loading vehicles', err);
            }
        })();

        return () => { mounted = false };
    }, []);

    // Helper functions for time adjustment
    const incArrivalHour = () => {
        setArrivalHours(prev => (prev + 1) % 24);
    };

    const decArrivalHour = () => {
        setArrivalHours(prev => (prev - 1 + 24) % 24);
    };

    const incArrivalMinute = () => {
        if (arrivalMinutes + 5 >= 60) {
            setArrivalMinutes(0);
            incArrivalHour();
        } else {
            setArrivalMinutes(prev => prev + 5);
        }
    };

    const decArrivalMinute = () => {
        if (arrivalMinutes - 5 < 0) {
            setArrivalMinutes(55);
            decArrivalHour();
        } else {
            setArrivalMinutes(prev => prev - 5);
        }
    };

    const selectPrevVehicle = () => {
        if (vehicles.length <= 1) return;
        const idx = vehicles.findIndex(v => v.vehicle_id === selectedVehicleId);
        const prev = idx <= 0 ? vehicles.length - 1 : idx - 1;
        setSelectedVehicleId(vehicles[prev].vehicle_id);
    };

    const selectNextVehicle = () => {
        if (vehicles.length <= 1) return;
        const idx = vehicles.findIndex(v => v.vehicle_id === selectedVehicleId);
        const next = idx === -1 || idx === vehicles.length - 1 ? 0 : idx + 1;
        setSelectedVehicleId(vehicles[next].vehicle_id);
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

                {/* Vehículo */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vehículo</Text>
                    {vehicles.length === 0 ? (
                        <View style={styles.row}>
                            <Text style={styles.label}>Sin vehículos</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('MyVehicles')}>
                                <Text style={{ color: '#2563EB' }}>Agregar vehículo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <TouchableOpacity onPress={selectPrevVehicle} style={{ padding: 8 }}>
                                <Ionicons name="chevron-back" size={20} color="#374151" />
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}>
                                {(() => {
                                    const sel = vehicles.find(v => v.vehicle_id === selectedVehicleId) || vehicles[0];
                                    return (
                                        <>
                                            <Text style={styles.label}>Seleccionado</Text>
                                            <Text style={styles.value}>{sel.plate_number} {sel.brand ? `· ${sel.brand}` : ''} {sel.model ? sel.model : ''}</Text>
                                        </>
                                    )
                                })()}
                            </View>

                            <TouchableOpacity onPress={selectNextVehicle} style={{ padding: 8 }}>
                                <Ionicons name="chevron-forward" size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Hora de llegada */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Hora de llegada</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 12 }}>
                        {/* Horas */}
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={incArrivalHour} style={styles.timeBtn}>
                                <Ionicons name="add" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            <Text style={[styles.timeInput, { textAlign: 'center' }]}>{String(arrivalHours).padStart(2, '0')}</Text>
                            <TouchableOpacity onPress={decArrivalHour} style={styles.timeBtn}>
                                <Ionicons name="remove" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>:</Text>

                        {/* Minutos */}
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={incArrivalMinute} style={styles.timeBtn}>
                                <Ionicons name="add" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            <Text style={[styles.timeInput, { textAlign: 'center' }]}>{String(arrivalMinutes).padStart(2, '0')}</Text>
                            <TouchableOpacity onPress={decArrivalMinute} style={styles.timeBtn}>
                                <Ionicons name="remove" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.helperText}>Llegada: {arrivalTimeStr} | Salida: {departureTimeStr}</Text>
                </View>

                {/* Duración */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Duración</Text>

                    <View style={styles.timeRow}>
                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setDurationHours(Math.max(1, durationHours - 1))}
                        >
                            <Ionicons name="remove" size={20} color="#2563EB" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.timeInput}
                            keyboardType="numeric"
                            value={durationHours.toString()}
                            onChangeText={(text) =>
                                setDurationHours(Number(text) > 0 ? Number(text) : 1)
                            }
                        />

                        <TouchableOpacity
                            style={styles.timeBtn}
                            onPress={() => setDurationHours(durationHours + 1)}
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
                        <Text style={styles.value}>{durationHours}</Text>
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

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/parking/Forms.reservation.styles";
import { createReservation } from "../../api/reservation/reservations.api";
import { getMyVehicles, Vehicle } from '../../api/vehiculo/vehicles.api';
import { SafeAreaView } from "react-native-safe-area-context";

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
    const [arrivalHours, setArrivalHours] = useState(14);
    const [arrivalMinutes, setArrivalMinutes] = useState(0);

    const pricePerHour = parking.price ? Number(parking.price) : 3;
    const total = pricePerHour * durationHours;

    const formatTime = (h: number, m: number) =>
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const arrivalTimeStr = formatTime(arrivalHours, arrivalMinutes);

    const departureTimeStr = (() => {
        let newH = arrivalHours + durationHours;
        if (newH >= 24) newH -= 24;
        return formatTime(newH, arrivalMinutes);
    })();

    // ← Variable del vehículo seleccionado AQUÍ, fuera del JSX
    const selectedVehicle = vehicles.find(v => v.vehicle_id === selectedVehicleId) || vehicles[0];
    const validateTime = () => {
        const now = new Date();
        const selected = new Date(
            now.getFullYear(), now.getMonth(), now.getDate(),
            arrivalHours, arrivalMinutes
        );
        if (selected < now) {
            Alert.alert("Error", "La hora de llegada no puede ser en el pasado");
            return false;
        }
        return true;
    };
    const handleConfirm = async () => {
        if (!selectedVehicleId) {
            Alert.alert("Error", "Selecciona un vehículo para continuar");
            return;
        }
        try {
            setLoading(true);
            const today = new Date();
            const startDate = new Date(
                today.getFullYear(), today.getMonth(), today.getDate(),
                arrivalHours, arrivalMinutes
            );
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + durationHours);

            const reservation = await createReservation({
                space_id: space.id,
                start_time: startDate.toISOString().slice(0, 19),
                end_time: endDate.toISOString().slice(0, 19),
                vehicle_id: selectedVehicleId,
            });

            navigation.replace("ReservationSuccess", {
                reservation: {
                    ...reservation,
                    qr_code: reservation.qr_code || reservation.id || null,
                },
                parking,
                space,
                total,
                arrivalTime: arrivalTimeStr,
                departureTime: departureTimeStr,
            });
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || error.message || "No se pudo crear la reserva");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const v = await getMyVehicles();
                if (!mounted) return;
                setVehicles(v || []);
                if (v && v.length > 0) {
                    setSelectedVehicleId(v[0].vehicle_id);
                }
            } catch {
                // silencioso
            }
        })();
        return () => { mounted = false; };
    }, []);

    const incArrivalHour = () => setArrivalHours(prev => (prev + 1) % 24);
    const decArrivalHour = () => setArrivalHours(prev => (prev - 1 + 24) % 24);

    const incArrivalMinute = () => {
        if (arrivalMinutes + 5 >= 60) { setArrivalMinutes(0); incArrivalHour(); }
        else setArrivalMinutes(prev => prev + 5);
    };

    const decArrivalMinute = () => {
        if (arrivalMinutes - 5 < 0) { setArrivalMinutes(55); decArrivalHour(); }
        else setArrivalMinutes(prev => prev - 5);
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmar reserva</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Detalle del parqueadero */}
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
                        <Text style={styles.value}>{space.code}</Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor: space.status === 'available' ? '#ECFDF5' : '#FEF2F2',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    alignSelf: 'flex-start',
                    marginTop: 4,
                }}>
                    <Text style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: space.status === 'available' ? '#10B981' : '#EF4444'
                    }}>
                        {space.status === 'available' ? 'Disponible' : 'Ocupado'}
                    </Text>
                </View>

                {/* Vehículo */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vehículo</Text>
                    {vehicles.length === 0 ? (
                        <View style={[styles.row, { justifyContent: 'center', paddingVertical: 20 }]}>
                            <Text style={[styles.label, { textAlign: 'center' }]}>
                                No tienes vehículos registrados
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('CreateVehicle')}
                                style={{ marginTop: 8 }}
                            >
                                <Text style={{ color: '#2563EB', fontWeight: '600' }}>Agregar vehículo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <TouchableOpacity onPress={selectPrevVehicle} style={{ padding: 8 }}>
                                <Ionicons name="chevron-back" size={20} color="#374151" />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Seleccionado</Text>
                                <Text style={styles.value} numberOfLines={1}>
                                    {selectedVehicle?.plate_number}
                                    {selectedVehicle?.brand ? ` · ${selectedVehicle.brand}` : ''}
                                    {selectedVehicle?.model ? ` ${selectedVehicle.model}` : ''}
                                </Text>
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
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={incArrivalHour} style={styles.timeBtn}>
                                <Ionicons name="add" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            <Text style={[styles.timeInput, { textAlign: 'center' }]}>
                                {String(arrivalHours).padStart(2, '0')}
                            </Text>
                            <TouchableOpacity onPress={decArrivalHour} style={styles.timeBtn}>
                                <Ionicons name="remove" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>:</Text>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={incArrivalMinute} style={styles.timeBtn}>
                                <Ionicons name="add" size={20} color="#2563EB" />
                            </TouchableOpacity>
                            <Text style={[styles.timeInput, { textAlign: 'center' }]}>
                                {String(arrivalMinutes).padStart(2, '0')}
                            </Text>
                            <TouchableOpacity onPress={decArrivalMinute} style={styles.timeBtn}>
                                <Ionicons name="remove" size={20} color="#2563EB" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.helperText}>
                        Llegada: {arrivalTimeStr} | Salida: {departureTimeStr}
                    </Text>
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
                            onChangeText={text => setDurationHours(Number(text) > 0 ? Number(text) : 1)}
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
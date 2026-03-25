import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const PaymentSuccessScreen = ({ route, navigation }: any) => {
    const { reservation, parking, total } = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>

                {/* Check animado */}
                <View style={{
                    width: 100, height: 100, borderRadius: 50,
                    backgroundColor: '#ECFDF5', justifyContent: 'center',
                    alignItems: 'center', marginBottom: 24,
                }}>
                    <Ionicons name="checkmark-circle" size={72} color="#10B981" />
                </View>

                <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8 }}>
                    ¡Pago exitoso!
                </Text>

                <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
                    Tu reserva en {parking.name} está confirmada
                </Text>

                {/* Monto */}
                <View style={{
                    backgroundColor: '#FFF', borderRadius: 16, padding: 20,
                    width: '100%', alignItems: 'center', marginBottom: 32,
                    borderWidth: 1, borderColor: '#E5E7EB',
                }}>
                    <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Total pagado</Text>
                    <Text style={{ fontSize: 36, fontWeight: '800', color: '#2563EB' }}>
                        ${Number(total).toFixed(2)}
                    </Text>
                </View>

                {/* Botones */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#2563EB', borderRadius: 12,
                        padding: 16, width: '100%', alignItems: 'center', marginBottom: 12,
                    }}
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>
                        Ver mis reservas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#F3F4F6', borderRadius: 12,
                        padding: 16, width: '100%', alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={{ color: '#374151', fontWeight: '600', fontSize: 16 }}>
                        Volver al inicio
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
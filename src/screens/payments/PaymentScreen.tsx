import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity,
    Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
    useStripe,
    CardField,
    CardFieldInput,
} from '@stripe/stripe-react-native';
import { paymentsApi } from '../../api/payments/payments.api';
import { PaymentIntent } from '@stripe/stripe-react-native';
interface PaymentScreenProps {
    route: any;
    navigation: any;
}

export const PaymentScreen = ({ route, navigation }: PaymentScreenProps) => {
    const { reservation, parking, total } = route.params;
    const { confirmPayment } = useStripe();

    const [loading, setLoading] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [loadingIntent, setLoadingIntent] = useState(true);

    // Crear PaymentIntent al cargar la pantalla
    useEffect(() => {
        const createIntent = async () => {
            try {
                const data = await paymentsApi.createIntent(reservation.id);
                setClientSecret(data.client_secret);
            } catch (error: any) {
                Alert.alert(
                    'Error',
                    error.response?.data?.message || 'No se pudo iniciar el pago',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } finally {
                setLoadingIntent(false);
            }
        };

        createIntent();
    }, []);

    const handlePay = async () => {
        if (!clientSecret || !cardComplete) return;

        setLoading(true);
        try {
            // 1. Confirmar pago con Stripe SDK
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
            });

            if (error) {
                Alert.alert('Pago rechazado', error.message);
                return;
            }

            if (paymentIntent?.status === 'Succeeded') {
                // 2. Notificar al backend
                await paymentsApi.confirm(paymentIntent.id);

                // 3. Navegar a éxito
                navigation.replace('PaymentSuccess', {
                    reservation,
                    parking,
                    total,
                    paymentIntentId: paymentIntent.id,
                });
            }
        } catch (error: any) {
            Alert.alert('Error', 'No se pudo procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    if (loadingIntent) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={{ marginTop: 12, color: '#6B7280' }}>
                    Preparando pago...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 14,
                backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#111827' }}>
                    Pago
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>

                {/* Resumen del pago */}
                <View style={{
                    backgroundColor: '#FFF', borderRadius: 16,
                    padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
                        Resumen
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#6B7280' }}>Parqueadero</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                            {parking.name}
                        </Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>Total</Text>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#2563EB' }}>
                            ${Number(total).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Formulario de tarjeta */}
                <View style={{
                    backgroundColor: '#FFF', borderRadius: 16,
                    padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
                        Datos de la tarjeta
                    </Text>

                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{ number: '4242 4242 4242 4242' }}
                        cardStyle={{
                            backgroundColor: '#F9FAFB',
                            textColor: '#111827',
                            borderColor: '#E5E7EB',
                            borderWidth: 1,
                            borderRadius: 10,
                        }}
                        style={{ width: '100%', height: 50 }}
                        onCardChange={(cardDetails: CardFieldInput.Details) => {
                            setCardComplete(cardDetails.complete);
                        }}
                    />

                    {/* Tarjeta de prueba */}
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', gap: 6,
                        marginTop: 10, padding: 10, backgroundColor: '#EFF6FF',
                        borderRadius: 8,
                    }}>
                        <Ionicons name="information-circle-outline" size={16} color="#2563EB" />
                        <Text style={{ fontSize: 12, color: '#1E40AF' }}>
                            Tarjeta de prueba: 4242 4242 4242 4242 · 12/34 · 123
                        </Text>
                    </View>
                </View>

                {/* Seguridad */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                        Pago seguro procesado por Stripe
                    </Text>
                </View>

            </ScrollView>

            {/* Botón pagar */}
            <View style={{ padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: cardComplete && !loading ? '#2563EB' : '#9CA3AF',
                        borderRadius: 12, padding: 16,
                        alignItems: 'center', flexDirection: 'row',
                        justifyContent: 'center', gap: 8,
                    }}
                    onPress={handlePay}
                    disabled={!cardComplete || loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFF" />
                        : <Ionicons name="card-outline" size={20} color="#FFF" />
                    }
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>
                        {loading ? 'Procesando...' : `Pagar $${Number(total).toFixed(2)}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
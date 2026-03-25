import React, { useState } from "react";
import {
    View, Text, TouchableOpacity,
    Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { qrApi } from "../../../../api/qr/qr.api";
import { useAuth } from "../../../../hooks/useAuth";

export const OperatorHomeScreen = () => {
    const { logout } = useAuth();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<{
        success: boolean;
        message: string;
        type?: string;
    } | null>(null);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (loading) return;
        setLoading(true);
        setScanning(false);

        try {
            const result = await qrApi.validate(data);
            setLastResult({
                success: true,
                message: result.message,
                type: result.type,
            });
        } catch (error: any) {
            setLastResult({
                success: false,
                message: error?.response?.data?.message || 'QR inválido o expirado',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
                <Text style={{ fontSize: 18, fontWeight: '700', marginTop: 16, color: '#111827' }}>
                    Permiso de cámara requerido
                </Text>
                <TouchableOpacity
                    style={{ backgroundColor: '#2563EB', borderRadius: 12, padding: 14, marginTop: 20 }}
                    onPress={requestPermission}
                >
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Permitir cámara</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 16, paddingVertical: 14,
                backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
            }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                    Panel Operador
                </Text>
                <TouchableOpacity onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, padding: 16 }}>
                {/* Scanner */}
                {scanning ? (
                    <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
                        <CameraView
                            style={{ flex: 1 }}
                            onBarcodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        />
                        <TouchableOpacity
                            style={{
                                position: 'absolute', bottom: 20, alignSelf: 'center',
                                backgroundColor: '#EF4444', borderRadius: 12,
                                paddingHorizontal: 24, paddingVertical: 12,
                            }}
                            onPress={() => setScanning(false)}
                        >
                            <Text style={{ color: '#FFF', fontWeight: '700' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>

                        {/* Resultado del último escaneo */}
                        {lastResult && (
                            <View style={{
                                width: '100%', padding: 16, borderRadius: 12,
                                backgroundColor: lastResult.success ? '#ECFDF5' : '#FEF2F2',
                                borderWidth: 1,
                                borderColor: lastResult.success ? '#10B981' : '#EF4444',
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons
                                        name={lastResult.success ? 'checkmark-circle' : 'close-circle'}
                                        size={24}
                                        color={lastResult.success ? '#10B981' : '#EF4444'}
                                    />
                                    <Text style={{
                                        fontSize: 16, fontWeight: '700',
                                        color: lastResult.success ? '#065F46' : '#991B1B',
                                    }}>
                                        {lastResult.type === 'ENTRY' ? 'ENTRADA' :
                                            lastResult.type === 'EXIT' ? 'SALIDA' :
                                                lastResult.success ? 'ÉXITO' : 'ERROR'}
                                    </Text>
                                </View>
                                <Text style={{
                                    marginTop: 6, fontSize: 14,
                                    color: lastResult.success ? '#065F46' : '#991B1B',
                                }}>
                                    {lastResult.message}
                                </Text>
                            </View>
                        )}

                        {/* Botón escanear */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#2563EB', borderRadius: 16,
                                padding: 24, alignItems: 'center', width: '100%', gap: 12,
                            }}
                            onPress={() => { setLastResult(null); setScanning(true); }}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#FFF" size="large" />
                                : <Ionicons name="qr-code-outline" size={64} color="#FFF" />
                            }
                            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 18 }}>
                                {loading ? 'Validando...' : 'Escanear QR'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
                            Escanea el QR del usuario para registrar entrada o salida
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};
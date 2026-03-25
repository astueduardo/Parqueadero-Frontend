import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getMyReservations, Reservation } from "../../api/reservation/reservations.api";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: '#92400E', bg: '#FEF3C7' },
  CONFIRMED: { label: 'Confirmada', color: '#065F46', bg: '#ECFDF5' },
  IN_PROGRESS: { label: 'En curso', color: '#1E40AF', bg: '#EFF6FF' },
  COMPLETED: { label: 'Completada', color: '#374151', bg: '#F3F4F6' },
  CANCELLED: { label: 'Cancelada', color: '#991B1B', bg: '#FEF2F2' },
  NO_SHOW: { label: 'No asistió', color: '#6B7280', bg: '#F9FAFB' },
};

export const HistoryScreen = ({ navigation }: any) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', padding: 16,
        backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' }}>
          Historial de reservas
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 }}>
              Sin reservas
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>
              Tus reservas aparecerán aquí
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
          const start = new Date(item.start_time);
          const end = new Date(item.end_time);

          return (
            <View style={{
              backgroundColor: '#FFF', borderRadius: 16,
              padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
            }}>
              {/* Status badge */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 20, backgroundColor: status.bg,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: status.color }}>
                    {status.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {start.toLocaleDateString('es-EC')}
                </Text>
              </View>

              {/* Info */}
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                    {(item as any).space?.lot?.name || 'Parqueadero'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="car-outline" size={16} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    Espacio {(item as any).space?.code || '-'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    {start.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                    {' → '}
                    {end.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};
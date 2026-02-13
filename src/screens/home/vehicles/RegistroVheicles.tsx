import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import {
  getMyVehicles,
  deleteVehicle,
  Vehicle,
} from "../../../api/vehiculo/vehicles.api";

import { styles } from "../../styles/vehicles/vehiclesList.styles";

export const VehicleListScreen = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [])
  );

  const loadVehicles = async () => {
    try {
      const data = await getMyVehicles();
      setVehicles(data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        "No se pudieron cargar los vehículos. Verifica tu conexión.";
      Alert.alert("Error al cargar", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const handleDelete = useCallback((id: string, plateNumber: string) => {
    Alert.alert(
      "Eliminar vehículo",
      `¿Estás seguro de eliminar el vehículo con placa ${plateNumber}?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Cancelado")
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => confirmDelete(id, plateNumber),
        },
      ],
      { cancelable: true }
    );
  }, []);

  const confirmDelete = async (id: string, plateNumber: string) => {
    setDeletingId(id);
    try {
      await deleteVehicle(id);

      // Animación de eliminación
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));

      // Feedback exitoso
      Alert.alert(
        "¡Listo!",
        `El vehículo ${plateNumber} fue eliminado correctamente.`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        "No se pudo eliminar el vehículo. Intenta nuevamente.";
      Alert.alert("Error", errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = useCallback((vehicle: Vehicle) => {
    navigation.navigate("EditVehicle", { vehicle });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: Vehicle; index: number }) => {
      const isDeleting = deletingId === item.id;

      return (
        <Animated.View
          style={[
            styles.cardWrapper,
            isDeleting && { opacity: 0.5 },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.card}
            onPress={() => handleEdit(item)}
            disabled={isDeleting}
          >
            <View style={styles.cardContent}>
              {/* Placa destacada */}
              <View style={styles.plateContainer}>
                <View style={styles.plateBadge}>
                  <Ionicons name="car-sport" size={18} color="#2563EB" />
                  <Text style={styles.plate}>{item.plate_number}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.plate_number)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.deleteButton}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Información del vehículo */}
              <View style={styles.infoSection}>
                <Text style={styles.brandModel}>
                  {item.brand} {item.model && `· ${item.model}`}
                </Text>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="color-palette-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.color}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="options-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.vehicle_type}</Text>
                  </View>

                  {item.year && (
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{item.year}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Indicador de edición */}
              <View style={styles.editIndicator}>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [deletingId, handleDelete, handleEdit]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="car-outline" size={64} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No hay vehículos</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primer vehículo presionando el botón {"\n"}
        <Text style={styles.emptyHighlight}>+</Text> abajo
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis vehículos</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerCount}>{vehicles.length}</Text>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          vehicles.length === 0 && styles.listContentEmpty
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* BOTÓN AGREGAR - FAB mejorado */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateVehicle")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
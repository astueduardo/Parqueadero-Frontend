// screens/parking/listparkings/ParkingListScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { useRealtime } from '../../../shared/hooks/useRealtime';
import { getParkingAvailability } from '../../../api/parking/parking-space';
import { Ionicons } from "@expo/vector-icons";

import { ParkingHeader } from "./components/ParkingHeader";
import { ParkingCard } from "./components/ParkingCard";
import { FilterModal } from "./components/FilterModal";
import { LoadingView } from "../../../shared/components/LoadingView";
import { useTheme } from "../../../context/ThemeContext";
import { useLocation } from "../../../shared/hooks/useLocation";
import { createParkingListStyles } from "../../../styles/parking/ParkingList.styles";
import {
  getAllParkingLots,
  getMyFavorites,
  toggleFavorite,
  ParkingLot,
} from "../../../api/parking/parkings.api";
import { getAllLotsAvailability } from '../../../api/parking/parking-space';

export interface ExtendedParkingLot extends ParkingLot {
  distance?: number;
  timeToArrive?: number;
  availableSpacesReal?: number;
  lastUpdated?: Date;
  isFavorite?: boolean;
}

// 📍 Haversine formula
const calculateDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const ParkingListScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = createParkingListStyles(colors);

  const [parkingLots, setParkingLots] = useState<ExtendedParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    maxPrice: number;
    minRating: number;
    sortBy: 'distance' | 'price' | 'rating';
    showOpenOnly: boolean;
  }>({
    maxPrice: 0,
    minRating: 0,
    sortBy: 'distance',
    showOpenOnly: false,
  });

  const { location, permissionDenied } = useLocation();

  // ─── TIEMPO REAL — 1 solo request ───────────────────────
  useRealtime(
    async () => {
      if (parkingLots.length === 0) return [];
      return await getAllLotsAvailability(); // ← 1 request en vez de N
    },
    (data: { lotId: string; availableCount: number }[]) => {
      if (data.length === 0) return;
      setParkingLots(prev => prev.map(lot => {
        const update = data.find(d => d.lotId === lot.id);
        return update
          ? { ...lot, availableSpacesReal: update.availableCount, lastUpdated: new Date() }
          : lot;
      }));
    },
    5000
  );

  // ─── CARGAR FAVORITOS ───────────────────────────────────
  const loadFavorites = useCallback(async (): Promise<string[]> => {
    try {
      const favorites = await getMyFavorites();
      const ids = favorites.map(f => f.parkingLotId);
      setFavoriteIds(ids);
      return ids;
    } catch {
      return [];
    }
  }, []);

  // ─── CARGAR PARQUEADEROS ────────────────────────────────
  const loadParkingLots = useCallback(async () => {
    try {
      setLoading(true);
      const [ids, lots] = await Promise.all([
        loadFavorites(),
        getAllParkingLots(),
      ]);

      const lotsWithDetails = lots.map(lot => {
        let distance = 0;
        let timeToArrive = 0;
        if (location?.latitude && location?.longitude && lot.latitude && lot.longitude) {
          distance = calculateDistance(
            location.latitude, location.longitude,
            lot.latitude, lot.longitude
          );
          timeToArrive = Math.round((distance / 30) * 60);
        }
        return {
          ...lot,
          distance,
          timeToArrive,
          isFavorite: ids.includes(lot.id),
          availableSpacesReal: lot.availableSpaces,
        };
      });

      setParkingLots(lotsWithDetails);
    } catch (error) {
      console.error("Error loading parking lots:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location, loadFavorites]);

  // ─── CARGAR AL MONTAR ───────────────────────────────────
  useEffect(() => {
    loadParkingLots();
  }, []);

  // ─── ACTUALIZAR DISTANCIAS CUANDO CAMBIA UBICACIÓN ─────
  useEffect(() => {
    if (!location?.latitude || !location?.longitude || parkingLots.length === 0) return;
    setParkingLots(prev => prev.map(lot => {
      if (!lot.latitude || !lot.longitude) return lot;
      const distance = calculateDistance(
        location.latitude, location.longitude,
        lot.latitude, lot.longitude
      );
      return { ...lot, distance, timeToArrive: Math.round((distance / 30) * 60) };
    }));
  }, [location]);

  // ─── RECARGAR FAVORITOS AL VOLVER ──────────────────────
  useFocusEffect(
    useCallback(() => {
      loadFavorites().then(ids => {
        setParkingLots(prev => prev.map(lot => ({
          ...lot,
          isFavorite: ids.includes(lot.id),
        })));
      });
    }, [loadFavorites])
  );

  // ─── FILTROS CON useMemo — sin useState ni useEffect ───
  const filteredLots = useMemo(() => {
    let filtered = [...parkingLots];

    if (searchQuery) {
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (showOnlyFavorites) {
      filtered = filtered.filter(lot => lot.isFavorite);
    }

    if (activeFilters.maxPrice > 0) {
      filtered = filtered.filter(lot => (lot.price ?? 0) <= activeFilters.maxPrice);
    }

    if (activeFilters.minRating > 0) {
      filtered = filtered.filter(lot => (lot.rating ?? 0) >= activeFilters.minRating);
    }

    if (activeFilters.showOpenOnly) {
      filtered = filtered.filter(lot => (lot.availableSpacesReal ?? 0) > 0);
    }

    filtered.sort((a, b) => {
      if (activeFilters.sortBy === 'price') return (a.price ?? 0) - (b.price ?? 0);
      if (activeFilters.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      const aSpaces = a.availableSpacesReal ?? 0;
      const bSpaces = b.availableSpacesReal ?? 0;
      if (aSpaces > 0 && bSpaces === 0) return -1;
      if (bSpaces > 0 && aSpaces === 0) return 1;
      return (a.distance ?? 999) - (b.distance ?? 999);
    });

    return filtered;
  }, [parkingLots, searchQuery, showOnlyFavorites, activeFilters]);

  // ─── TOGGLE FAVORITO ────────────────────────────────────
  const handleToggleFavorite = async (lotId: string) => {
    try {
      const result = await toggleFavorite(lotId);
      const updatedIds = result.isFavorite
        ? [...favoriteIds, lotId]
        : favoriteIds.filter(id => id !== lotId);
      setFavoriteIds(updatedIds);
      setParkingLots(prev => prev.map(lot =>
        lot.id === lotId ? { ...lot, isFavorite: result.isFavorite } : lot
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) return <LoadingView message="Cargando parqueaderos..." />;

  if (permissionDenied) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="location-outline" size={48} color="#9CA3AF" />
        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12, color: '#374151' }}>
          Necesitamos tu ubicación
        </Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
          Activa los permisos de ubicación para ver los parqueaderos cercanos
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ParkingHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFilters={() => setModalVisible(true)}
        onToggleFavorites={() => setShowOnlyFavorites(prev => !prev)}
        showOnlyFavorites={showOnlyFavorites}
        onBack={() => navigation.goBack()}
        locationAddress={location?.address || 'Loja'}
        locationCity={location?.city || 'Loja'}
      />

      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredLots.length} parqueadero{filteredLots.length !== 1 ? 's' : ''}
          {showOnlyFavorites && " ❤️ Favoritos"}
        </Text>
      </View>

      <FlatList
        data={filteredLots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParkingCard
            lot={item}
            onPress={() => navigation.navigate("ParkingDetail", { parking: item })}
            onFavoritePress={() => handleToggleFavorite(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadParkingLots(); }} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={showOnlyFavorites ? "heart-outline" : "car-outline"}
              size={64}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>
              {showOnlyFavorites ? "No hay favoritos" : "No hay parqueaderos"}
            </Text>
            <Text style={styles.emptyText}>
              {showOnlyFavorites
                ? "Agrega parqueaderos a favoritos para verlos aquí"
                : "No encontramos parqueaderos que coincidan con tu búsqueda"}
            </Text>
          </View>
        }
      />

      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filters={activeFilters}
        onApply={(filters) => setActiveFilters(filters)}
      />
    </SafeAreaView>
  );
};
// screens/parking/listparkings/components/ParkingHeader.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../context/ThemeContext";
import { createParkingCardStyles } from "../../../../styles/parking/components/styleCards";

interface HeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
  onOpenFilters: () => void;
  onToggleFavorites: () => void;
  showOnlyFavorites: boolean;
  onBack: () => void;
  locationAddress?: string;
  locationCity?: string;
}

export const ParkingHeader = ({
  search,
  onSearchChange,
  onOpenFilters,
  onToggleFavorites,
  showOnlyFavorites,
  onBack,
  locationAddress = 'Centro',
  locationCity = 'Loja',
}: HeaderProps) => {
  const { colors } = useTheme();
  const styles = createParkingCardStyles(colors);

  return (
    <View style={styles.header}>
      {/* BACK + UBICACIÓN */}
      <View style={styles.locationContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Contenedor centrado */}
        <View style={styles.locationCenter}>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={30} color={colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Tu ubicación</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {locationAddress}, {locationCity}
              </Text>
            </View>
          </View>
        </View>

        {/* Espacio vacío para equilibrar */}
        <View style={{ width: 40 }} />
      </View>

      {/* BUSCADOR + FILTRO + FAVORITOS */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar parqueadero"
            value={search}
            onChangeText={onSearchChange}
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          onPress={onToggleFavorites}
          style={[
            styles.filterButton,
            {
              backgroundColor: showOnlyFavorites ? "#EF4444" : colors.primary,
              marginRight: 8
            }
          ]}
        >
          <Ionicons
            name={showOnlyFavorites ? "heart" : "heart-outline"}
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenFilters} style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

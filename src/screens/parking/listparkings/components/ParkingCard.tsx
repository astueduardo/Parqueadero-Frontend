// screens/parking/listparkings/components/ParkingCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExtendedParkingLot } from "../ParkingListScreen";
import { useTheme } from "../../../../context/ThemeContext";
import { createParkingCardStyles } from "../../../../styles/parking/components/styleCards";
import { openGoogleMaps } from '../../../../shared/utils/navegation';
interface ParkingCardProps {
    lot: ExtendedParkingLot;
    onPress: () => void;
    onFavoritePress?: () => void;
}

export const ParkingCard = ({
    lot,
    onPress,
    onFavoritePress
}: ParkingCardProps) => {
    const { colors } = useTheme();
    const styles = createParkingCardStyles(colors);

    // ✅ VALORES SEGUROS - todos con fallbacks
    const safeLot = {
        id: lot?.id || '',
        name: lot?.name || 'Sin nombre',
        address: lot?.address || 'Dirección no disponible',
        totalSpaces: typeof lot?.totalSpaces === 'number' ? lot.totalSpaces : 0,
        availableSpaces: typeof lot?.availableSpaces === 'number' ? lot.availableSpaces : 0,
        availableSpacesReal: typeof lot?.availableSpacesReal === 'number' ? lot.availableSpacesReal : lot?.availableSpaces || 0,
        price: typeof lot?.price === 'number' ? lot.price : 0,
        rating: typeof lot?.rating === 'number' ? lot.rating : 0,
        distance: typeof lot?.distance === 'number' ? lot.distance : 0,
        timeToArrive: typeof lot?.timeToArrive === 'number' ? lot.timeToArrive : 0,
        isFavorite: !!lot?.isFavorite,
    };

    const availability = safeLot.totalSpaces > 0
        ? ((safeLot.totalSpaces - safeLot.availableSpacesReal) / safeLot.totalSpaces) * 100
        : 0;

    const hasSpaces = safeLot.availableSpacesReal > 0;

    const getProgressColor = () => {
        if (availability >= 90) return '#EF4444';
        if (availability >= 70) return '#F59E0B';
        return '#10B981';
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            {/* HEADER con nombre y rating */}
            <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                    <Text style={styles.cardTitle}>{safeLot.name}</Text>
                    {safeLot.rating > 0 && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FBBF24" />
                            <Text style={styles.ratingText}>{safeLot.rating.toFixed(1)}</Text>
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {onFavoritePress && (
                        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
                            <Ionicons
                                name={safeLot.isFavorite ? "heart" : "heart-outline"}
                                size={22}
                                color={safeLot.isFavorite ? "#EF4444" : colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}

                    <View style={[styles.statusBadge, {
                        backgroundColor: hasSpaces ? '#DEF7E5' : '#FEE2E2'
                    }]}>
                        <Text style={[styles.statusText, {
                            color: hasSpaces ? '#10B981' : '#EF4444'
                        }]}>
                            {hasSpaces ? 'Disponible' : 'Lleno'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* DIRECCIÓN */}
            <Text style={styles.address}>{safeLot.address}</Text>

            {/* INFORMACIÓN PRINCIPAL */}
            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Ionicons name="car" size={14} color={colors.textMuted} />
                    <Text style={styles.infoText}>
                        {safeLot.availableSpacesReal}/{safeLot.totalSpaces} espacios
                    </Text>
                </View>

                {safeLot.distance > 0 ? (
                    <View style={styles.infoItem}>
                        <Ionicons name="location" size={14} color={colors.textMuted} />
                        <Text style={styles.infoText}>{safeLot.distance.toFixed(1)} km</Text>
                    </View>
                ) : null}

                {safeLot.timeToArrive > 0 ? (
                    <View style={styles.infoItem}>
                        <Ionicons name="time" size={14} color={colors.textMuted} />
                        <Text style={styles.infoText}>{safeLot.timeToArrive} min</Text>
                    </View>
                ) : null}
            </View>

            {/* PRECIO */}
            {safeLot.price > 0 && (
                <View style={styles.priceRow}>
                    <Text style={styles.price}>
                        ${safeLot.price.toFixed(2)} <Text style={styles.perHour}>/hora</Text>
                    </Text>
                </View>
            )}

            {/* BARRA DE PROGRESO */}
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${availability}%`,
                            backgroundColor: getProgressColor()
                        }
                    ]}
                />
            </View>

            {/* TIMESTAMP */}
            {lot?.lastUpdated && (
                <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>
                    Actualizado: {new Date(lot.lastUpdated).toLocaleTimeString()}
                </Text>
            )}

            {/* BOTÓN CÓMO LLEGAR — solo si hay coordenadas reales */}
            {lot.latitude && lot.longitude ? (
                <TouchableOpacity
                    onPress={() => openGoogleMaps(lot.latitude!, lot.longitude!)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.primary,
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 8,
                        gap: 6,
                    }}
                >
                    <Ionicons name="navigate-outline" size={16} color="#FFF" />
                    <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 13 }}>
                        Cómo llegar
                    </Text>
                </TouchableOpacity>
            ) : null}

        </TouchableOpacity>
    );
};
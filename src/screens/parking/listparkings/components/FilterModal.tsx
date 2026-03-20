// screens/parking/listparkings/components/FilterModal.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTheme } from "../../../../context/ThemeContext";
import { createParkingCardStyles } from "../../../../styles/parking/components/styleCards";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filters?: {
        maxPrice: number;
        minRating: number;
        sortBy: 'distance' | 'price' | 'rating';
        showOpenOnly: boolean;
    };
    onApply?: (filters: any) => void;
}

export const FilterModal = ({
    visible,
    onClose,
    filters: initialFilters = {
        maxPrice: 0,
        minRating: 0,
        sortBy: 'distance',
        showOpenOnly: false
    },
    onApply = () => { }
}: FilterModalProps) => {
    const { colors } = useTheme();
    const styles = createParkingCardStyles(colors);

    const [localFilters, setLocalFilters] = useState(initialFilters);
    const [tempPrice, setTempPrice] = useState(initialFilters.maxPrice || 5);
    const [tempRating, setTempRating] = useState(initialFilters.minRating || 0);

    const handleReset = () => {
        const resetFilters = {
            maxPrice: 0,
            minRating: 0,
            sortBy: 'distance' as const,
            showOpenOnly: false,
        };
        setLocalFilters(resetFilters);
        setTempPrice(5);
        setTempRating(0);
    };

    const handleApply = () => {
        onApply({
            ...localFilters,
            maxPrice: tempPrice === 5 ? 0 : tempPrice,
            minRating: tempRating,
        });
        onClose();
    };

    const ratingOptions = [0, 3, 3.5, 4, 4.5];
    const sortOptions = [
        { value: 'distance', label: 'Distancia', icon: 'location-outline' },
        { value: 'price', label: 'Precio', icon: 'pricetag-outline' },
        { value: 'rating', label: 'Calificación', icon: 'star-outline' },
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtros</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                        {/* Ordenar por */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                {sortOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => setLocalFilters({
                                            ...localFilters,
                                            sortBy: option.value as any
                                        })}
                                        style={[
                                            styles.filterChip,
                                            localFilters.sortBy === option.value
                                                ? styles.filterChipActive
                                                : styles.filterChipInactive
                                        ]}
                                    >
                                        <Ionicons
                                            name={option.icon as any}
                                            size={16}
                                            color={localFilters.sortBy === option.value ? '#FFF' : colors.textMuted}
                                        />
                                        <Text style={[
                                            styles.filterChipText,
                                            localFilters.sortBy === option.value
                                                ? styles.filterChipTextActive
                                                : styles.filterChipTextInactive
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Precio máximo */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Precio máximo por hora</Text>
                            <View style={styles.sliderContainer}>
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderLabelMin}>$0</Text>
                                    <Text style={styles.sliderValue}>
                                        {tempPrice === 5 ? 'Sin límite' : `$${tempPrice.toFixed(2)}`}
                                    </Text>
                                </View>

                                <Slider
                                    minimumValue={0}
                                    maximumValue={5}
                                    step={0.5}
                                    value={tempPrice}
                                    onValueChange={setTempPrice}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.border}
                                    thumbTintColor={colors.primary}
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                    <Text style={{ fontSize: 12, color: colors.textMuted }}>$0</Text>
                                    <Text style={{ fontSize: 12, color: colors.textMuted }}>$2.5</Text>
                                    <Text style={{ fontSize: 12, color: colors.textMuted }}>$5+</Text>
                                </View>
                            </View>
                        </View>

                        {/* Calificación mínima */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Calificación mínima</Text>
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                {ratingOptions.map((rating) => (
                                    <TouchableOpacity
                                        key={rating}
                                        onPress={() => setTempRating(rating)}
                                        style={[
                                            styles.filterChip,
                                            tempRating === rating ? styles.filterChipActive : styles.filterChipInactive
                                        ]}
                                    >
                                        {rating > 0 && (
                                            <Ionicons
                                                name="star"
                                                size={14}
                                                color={tempRating === rating ? '#FFF' : '#FBBF24'}
                                            />
                                        )}
                                        <Text style={[
                                            styles.filterChipText,
                                            tempRating === rating ? styles.filterChipTextActive : styles.filterChipTextInactive
                                        ]}>
                                            {rating === 0 ? 'Cualquiera' : rating.toFixed(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Solo disponibles */}
                        <View style={styles.filterSection}>
                            <TouchableOpacity
                                onPress={() => setLocalFilters({
                                    ...localFilters,
                                    showOpenOnly: !localFilters.showOpenOnly
                                })}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: colors.background,
                                    padding: 16,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons
                                        name={localFilters.showOpenOnly ? "checkbox" : "square-outline"}
                                        size={22}
                                        color={localFilters.showOpenOnly ? colors.success : colors.textMuted}
                                    />
                                    <Text style={{ marginLeft: 12, fontSize: 16, color: colors.text }}>
                                        Solo mostrar disponibles
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Restablecer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
                            <Text style={styles.applyButtonText}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
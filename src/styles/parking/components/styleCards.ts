// styles/parking/ParkingCard.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../../utils/theme";

const { width } = Dimensions.get('window');

export const createParkingCardStyles = (colors: Theme['colors']) => StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.borderLight,
        // Sombra para dar profundidad
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },

    titleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.text,
    },

    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 2,
    },

    ratingText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#92400E",
    },

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },

    address: {
        fontSize: 13,
        color: colors.textMuted,
        marginBottom: 12,
        lineHeight: 18,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 12,
    },

    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    infoText: {
        fontSize: 12,
        color: colors.textSecondary,
    },

    priceRow: {
        marginBottom: 12,
    },

    price: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
    },

    perHour: {
        fontSize: 12,
        fontWeight: "400",
        color: colors.textMuted,
    },

    progressBar: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: "hidden",
    },

    progressFill: {
        height: 6,
        borderRadius: 3,
    },

    // Para cuando no hay resultados
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginTop: 16,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: "center",
        lineHeight: 20,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: 10,
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    locationCenter: {
        flex: 1,
        alignItems: "center",
    },

    locationInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },

    locationTextContainer: {
    },

    locationLabel: {
        fontSize: 12,
        color: colors.textMuted,
    },

    locationValue: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text,
        maxWidth: 180,
    },
    // Para pantalla de carga
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        gap: 12,
    },

    loadingText: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 8,
    },

    // Contador de resultados
    countContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background,
    },

    countText: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: "500",
    },

    listContent: {
        paddingTop: 8,
        paddingBottom: 20,
    },

    // Estilos para el header
    header: {
        backgroundColor: colors.card,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },


    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },

    searchIcon: {
        marginRight: 8,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },

    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },


    // Para el modal de filtros (si quieres incluirlo aquí)
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: Dimensions.get('window').height * 0.9,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },

    modalBody: {
        padding: 20,
    },

    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        gap: 12,
    },

    filterSection: {
        marginBottom: 24,
    },

    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },

    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },

    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    filterChipInactive: {
        backgroundColor: colors.background,
        borderColor: colors.border,
    },

    filterChipText: {
        marginLeft: 6,
        fontWeight: '500',
    },

    filterChipTextActive: {
        color: '#FFF',
    },

    filterChipTextInactive: {
        color: colors.text,
    },

    sliderContainer: {
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },

    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    sliderLabelMin: {
        color: colors.textMuted,
    },

    sliderValue: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 18,
    },

    resetButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },

    resetButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '500',
    },

    applyButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: colors.primary,
    },

    applyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },

    favoriteButton: {
        padding: 4,
        marginRight: 8,
    },

    favoriteButtonActive: {
        backgroundColor: '#FEE2E2',
        borderRadius: 20,
        padding: 4,
        marginRight: 8,
    },
});
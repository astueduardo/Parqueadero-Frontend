import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    // HEADER
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        fontSize: 21,
        fontWeight: "700",
        color: "#111827",
    },
    headerBadge: {
        backgroundColor: "#2563EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        minWidth: 32,
        alignItems: "center",
    },
    headerCount: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },

    // LOADING
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "500",
    },

    // LISTA
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    listContentEmpty: {
        flexGrow: 1,
    },

    // CARD
    cardWrapper: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    cardContent: {
        gap: 16,
    },

    // PLACA
    plateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    plateBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF6FF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    plate: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E40AF",
        letterSpacing: 1,
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#FEF2F2",
        alignItems: "center",
        justifyContent: "center",
    },

    // INFO SECTION
    infoSection: {
        gap: 8,
    },
    brandModel: {
        fontSize: 20,
        fontWeight: "600",
        color: "#111827",
    },
    detailsRow: {
        flexDirection: "row",
        gap: 16,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },

    // EDIT INDICATOR
    editIndicator: {
        position: "absolute",
        right: 20,
        bottom: 20,
    },

    // EMPTY STATE
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 24,
    },
    emptyHighlight: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2563EB",
    },

    // FAB
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#2563EB",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 8,
    },
});
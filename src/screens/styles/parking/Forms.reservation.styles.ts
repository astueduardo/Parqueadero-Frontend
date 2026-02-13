import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },

    label: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },

    value: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
        marginLeft: 16,
    },

    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 12,
        gap: 20,
    },

    timeBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },

    timeInput: {
        width: 80,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#2563EB",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },

    helperText: {
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 8,
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },

    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    totalValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2563EB",
    },

    footer: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    confirmBtn: {
        backgroundColor: "#2563EB",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        shadowColor: "#2563EB",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },

    confirmBtnDisabled: {
        backgroundColor: "#9CA3AF",
        shadowOpacity: 0,
        elevation: 0,
    },

    confirmText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
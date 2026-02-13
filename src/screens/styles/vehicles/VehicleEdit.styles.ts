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
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.2,
    },

    form: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 100,
    },

    inputContainer: {
        marginBottom: 20,
    },

    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#374151",
        letterSpacing: -0.2,
    },

    required: {
        color: "#EF4444",
        fontSize: 15,
        fontWeight: "600",
    },

    errorText: {
        fontSize: 13,
        color: "#EF4444",
        fontWeight: "500",
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 52,
    },

    inputWrapperError: {
        borderColor: "#EF4444",
        backgroundColor: "#FEF2F2",
    },

    inputWrapperFilled: {
        borderColor: "#2563EB",
        backgroundColor: "#EFF6FF",
    },

    inputIcon: {
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },

    // Estilos para sugerencias de colores
    suggestionsContainer: {
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    suggestionsTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 8,
        letterSpacing: -0.2,
    },

    suggestionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    suggestionChip: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    suggestionText: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
    },

    // Estilos para sugerencias de tipos de vehículo
    typeSuggestionsContainer: {
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    typeSuggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
    },

    typeSuggestionText: {
        fontSize: 15,
        color: "#374151",
        fontWeight: "500",
        marginLeft: 12,
    },

    buttonContainer: {
        marginTop: 24,
        gap: 12,
    },

    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        gap: 8,
    },

    saveButtonDisabled: {
        backgroundColor: "#9CA3AF",
        shadowOpacity: 0,
        elevation: 0,
    },

    saveButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: -0.2,
    },

    cancelButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
        letterSpacing: -0.2,
    },

    requiredNote: {
        fontSize: 13,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 16,
        fontStyle: "italic",
    },
});
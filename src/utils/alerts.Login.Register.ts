// utils/alerts.ts
import { Alert } from "react-native";

export const showError = (message: string) => {
    Alert.alert("Error", message);
};

export const showSuccess = (message: string) => {
    Alert.alert("Éxito", message);
};

export const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
) => {
    Alert.alert(
        title,
        message,
        [
            { text: "Cancelar", style: "cancel", onPress: onCancel },
            { text: "Aceptar", onPress: onConfirm },
        ]
    );
};
// shared/components/InfoCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createHomeStyles } from "../../styles/home/HomeScreen.styles";

interface InfoCardProps {
    title: string;
    value: string;
    icon: string;
    onPress: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, onPress }) => {
    const { colors } = useTheme();
    const styles = createHomeStyles(colors);

    return (
        <TouchableOpacity
            style={styles.infoCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.infoCardIcon}>{icon}</Text>
            <Text style={styles.infoCardTitle}>{title}</Text>
            <Text style={styles.infoCardValue}>{value}</Text>
        </TouchableOpacity>
    );
};
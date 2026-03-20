// shared/components/ActionCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createHomeStyles } from "../../styles/home/HomeScreen.styles";

const { width } = Dimensions.get('window');

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress
}) => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: color }
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};
// shared/components/EmptyView.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface EmptyViewProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title?: string;
    message?: string;
}

export const EmptyView = ({
    icon = 'car-outline',
    title = 'No hay resultados',
    message = 'No encontramos lo que buscas'
}: EmptyViewProps) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={colors.textMuted} />
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    message: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
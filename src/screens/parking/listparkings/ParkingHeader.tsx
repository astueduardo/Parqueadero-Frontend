import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
  onOpenFilters: () => void;
  onBack: () => void;
}

export const ParkingHeader = ({
  search,
  onSearchChange,
  onOpenFilters,
  onBack,
}: HeaderProps) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
        paddingLeft: 20,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* 🔙 BACK + UBICACIÓN */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,

        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 100 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Ionicons name="location-outline" size={20} color="#2563EB" />
        <View style={{
          marginLeft: 10

        }}>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            Tu ubicación
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Centro, Loja
          </Text>
        </View>
      </View>

      {/* 🔍 BUSCADOR + FILTRO */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F3F4F6",
            borderRadius: 14,
            paddingHorizontal: 12,
            height: 48,
          }}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Buscar parqueadero"
            value={search}
            onChangeText={onSearchChange}
            placeholderTextColor="#9CA3AF"
            style={{
              marginLeft: 8,
              flex: 1,
              fontSize: 14,
              color: "#111827",
            }}
          />
        </View>

        <TouchableOpacity
          onPress={onOpenFilters}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

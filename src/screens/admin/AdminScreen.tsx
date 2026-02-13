import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/panels/panelA.styles";
import { AuthContext } from '../../context/AuthContext';

export const AdminHomeScreen: React.FC = () => {

  const auth = useContext(AuthContext);
  const navigation = useNavigation<any>();

  if (!auth) return null;

  const { user, logout } = auth;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminUsers")}
      >
        <Text style={styles.cardTitle}>👤 Usuarios</Text>
        <Text style={styles.cardText}>Gestionar usuarios y roles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminParkings")}
      >
        <Text style={styles.cardTitle}>🅿️ Parqueaderos</Text>
        <Text style={styles.cardText}>Administrar parqueaderos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminPayments")}
      >
        <Text style={styles.cardTitle}>💳 Pagos</Text>
        <Text style={styles.cardText}>Ver historial de pagos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

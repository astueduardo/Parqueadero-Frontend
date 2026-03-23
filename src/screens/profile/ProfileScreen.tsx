import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/home/profile.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../../api/axios/axiosInstance';


export const ProfileScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  const handleEditName = () => {
    setNewName(user?.name || '');
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    setSavingName(true);
    try {
      await apiService.api.patch('/users/profile', { name: newName.trim() });
      // Actualiza el nombre en el contexto
      if (auth.user) auth.user.name = newName.trim();
      setEditingName(false);
      Alert.alert("¡Éxito!", "Nombre actualizado correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "No se pudo actualizar el nombre");
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              {editingName ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                    style={{
                      flex: 1, fontSize: 16, fontWeight: '700',
                      borderBottomWidth: 1.5, borderBottomColor: '#2563EB',
                      paddingVertical: 2, color: '#111827',
                    }}
                  />
                  {savingName ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : (
                    <>
                      <TouchableOpacity onPress={handleSaveName}>
                        <Ionicons name="checkmark" size={22} color="#2563EB" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingName(false)}>
                        <Ionicons name="close" size={22} color="#9CA3AF" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.name}>{user?.name}</Text>
                  <TouchableOpacity onPress={handleEditName}>
                    <Ionicons name="pencil-outline" size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.subtext}>Usuario verificado</Text>
            </View>
          </View>

          <InfoRow icon="mail" label="Correo" value={user?.email} />
          <InfoRow icon="shield-checkmark-outline" label="Proveedor" value={user?.auth_provider || 'local'} />
        </View>

        {/* Mis cosas */}
        <SectionCard title="Mi cuenta">
          <MenuItem
            icon="car-outline"
            label="Mis vehículos"
            onPress={() => navigation.navigate('Vehicles')}
          />
          <MenuItem
            icon="time-outline"
            label="Historial de reservas"
            onPress={() => navigation.navigate('History')}
          />
        </SectionCard>

        <SectionCard title="Preferencias">
          <MenuItem icon="notifications-outline" label="Notificaciones" />
          <MenuItem icon="moon-outline" label="Tema oscuro" />
        </SectionCard>

        <SectionCard title="Legal">
          <LinkItem label="Términos y condiciones" />
          <LinkItem label="Política de privacidad" />
        </SectionCard>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ParkEasy v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#6B7280" />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const MenuItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={20} color="#6B7280" />
      <Text style={styles.optionText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

const SectionCard = ({ title, children }: any) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const LinkItem = ({ label, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.link}>{label}</Text>
  </TouchableOpacity>
);
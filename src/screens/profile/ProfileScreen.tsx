import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/home/profile.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
export const ProfileScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<any>();

  if (!auth) return null;

  const { user, logout } = auth;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.subtext}>Usuario verificado</Text>
            </View>
          </View>

          <InfoRow icon="mail" label="Correo" value={user?.email} />


          <TouchableOpacity style={styles.outlineBtn}>
            <Text style={styles.outlineText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <SectionCard title="Preferencias">
          <MenuItem icon="notifications" label="Notificaciones" />
          <MenuItem icon="card" label="Métodos de pago" />
          <MenuItem icon="shield-checkmark" label="Privacidad y seguridad" />
        </SectionCard>

        <SectionCard title="Legal">
          <LinkItem label="Términos y condiciones" />
          <LinkItem label="Política de privacidad" />
          <LinkItem label="Política de cancelación" />
        </SectionCard>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
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

/* ---------- Components ---------- */

const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#6B7280" />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const MenuItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.option}>
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

const LinkItem = ({ label }: any) => (
  <TouchableOpacity>
    <Text style={styles.link}>{label}</Text>
  </TouchableOpacity>
);

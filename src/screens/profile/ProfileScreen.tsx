import React, { useContext, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Alert, TextInput, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/home/profile.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../../api/axios/axiosInstance';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [editingName, setEditingName] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  // ── Avatar source ─────────────────────────────
  const getAvatarSource = () => {
    if (user?.avatar_url) return { uri: user.avatar_url };
    if (user?.picture) return { uri: user.picture }; // Google photo
    return null;
  };

  const avatarSource = getAvatarSource();

  // ── Editar foto ───────────────────────────────
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // cuadrado para el círculo
      quality: 0.5,   // compresión para reducir tamaño base64
      base64: true,   // ← devuelve base64
    });

    if (result.canceled || !result.assets[0].base64) return;

    setUploadingAvatar(true);
    try {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await apiService.api.patch('/users/me/avatar', { avatar_url: base64 });
      await auth.getProfile();
      Alert.alert('¡Listo!', 'Foto actualizada correctamente');
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo actualizar la foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Editar nombre ─────────────────────────────
  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    setSavingName(true);
    try {
      await apiService.api.patch('/users/me', { name: newName.trim() });
      await auth.getProfile();
      setEditingName(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar');
    } finally {
      setSavingName(false);
    }
  };

  // ── Editar username ───────────────────────────
  const handleSaveUsername = async () => {
    setSavingUsername(true);
    try {
      await apiService.api.patch('/users/me', { username: newUsername.trim() || null });
      await auth.getProfile();
      setEditingUsername(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo actualizar');
    } finally {
      setSavingUsername(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
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
        {/* Avatar + nombre */}
        <View style={styles.card}>
          <View style={styles.userRow}>

            {/* Avatar con botón editar */}
            <TouchableOpacity
              onPress={handlePickAvatar}
              disabled={uploadingAvatar}
              style={{ position: 'relative' }}
            >
              {avatarSource ? (
                <Image
                  source={avatarSource}
                  style={{
                    width: 80, height: 80,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: '#2563EB',
                  }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  {uploadingAvatar
                    ? <ActivityIndicator color="#2563EB" />
                    : <Text style={{ fontSize: 32, fontWeight: '700', color: '#2563EB' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Text>
                  }
                </View>
              )}

              {/* Ícono cámara sobre el avatar */}
              {!uploadingAvatar && (
                <View style={{
                  position: 'absolute', bottom: 0, right: 0,
                  backgroundColor: '#2563EB', borderRadius: 12,
                  padding: 4, borderWidth: 2, borderColor: '#FFF',
                }}>
                  <Ionicons name="camera" size={12} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 16 }}>
              {/* Nombre editable */}
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
                  {savingName
                    ? <ActivityIndicator size="small" color="#2563EB" />
                    : <>
                      <TouchableOpacity onPress={handleSaveName}>
                        <Ionicons name="checkmark" size={22} color="#2563EB" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingName(false)}>
                        <Ionicons name="close" size={22} color="#9CA3AF" />
                      </TouchableOpacity>
                    </>
                  }
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.name}>{user?.name}</Text>
                  <TouchableOpacity onPress={() => {
                    setNewName(user?.name || '');
                    setEditingName(true);
                  }}>
                    <Ionicons name="pencil-outline" size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Username editable */}
              {editingUsername ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <TextInput
                    value={newUsername}
                    onChangeText={setNewUsername}
                    autoFocus
                    autoCapitalize="none"
                    placeholder="@usuario"
                    style={{
                      flex: 1, fontSize: 14,
                      borderBottomWidth: 1.5, borderBottomColor: '#2563EB',
                      paddingVertical: 2, color: '#6B7280',
                    }}
                  />
                  {savingUsername
                    ? <ActivityIndicator size="small" color="#2563EB" />
                    : <>
                      <TouchableOpacity onPress={handleSaveUsername}>
                        <Ionicons name="checkmark" size={20} color="#2563EB" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingUsername(false)}>
                        <Ionicons name="close" size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </>
                  }
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Text style={styles.subtext}>
                    {user?.username ? `@${user.username}` : 'Sin username'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setNewUsername(user?.username || '');
                    setEditingUsername(true);
                  }}>
                    <Ionicons name="pencil-outline" size={12} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <InfoRow icon="mail" label="Correo" value={user?.email} />
          <InfoRow
            icon={user?.auth_provider === 'google' ? 'logo-google' : 'lock-closed-outline'}
            label="Proveedor"
            value={user?.auth_provider === 'google' ? 'Google' : 'Email y contraseña'}
          />
        </View>

        {/* Mi cuenta */}
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
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usersApi, User, UpdateUserDto } from "../../../api/users/users.api";
import { useAuth } from "../../../hooks/useAuth";
import { styles } from "../../../styles/panels/user";

export const AdminUsersScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  /* 
    PROTECCIÓN DE ROL
  */
  useEffect(() => {
    if (user && user.role !== "admin") {
      Alert.alert("Acceso denegado", "No tienes permisos para ver esta pantalla");
      navigation.replace("Home");
    }
  }, [user, navigation]);

  /* 
    CARGAR USUARIOS
  */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* 
    BUSCADOR - FILTRO EN TIEMPO REAL
  */
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (!text.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = text.toLowerCase().trim();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.role && user.role.toLowerCase().includes(query))
    );

    setFilteredUsers(filtered);
  };

  /* 
    EDITAR
  */
  const openEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole((user.role as "user" | "admin") ?? "user");
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingUser) return;

    try {
      const payload: UpdateUserDto = { name, email };
      await usersApi.update(editingUser.id, payload);

      if (editingUser.role !== role) {
        await usersApi.setRole(editingUser.id, { role });
      }

      setModalVisible(false);
      fetchUsers();
      Alert.alert("Éxito", "Usuario actualizado correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario");
      console.error(error);
    }
  };

  /* 
    ELIMINAR
  */
  const removeUser = (user: User) => {
    // No permitir eliminar al propio admin
    if (user.id === user?.id) {
      Alert.alert("Error", "No puedes eliminar tu propio usuario");
      return;
    }

    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de eliminar a ${user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await usersApi.remove(user.id);
              fetchUsers();
              Alert.alert("Éxito", "Usuario eliminado correctamente");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  if (!user || user.role !== "admin") return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Administrar Usuarios</Text>
        <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, email o rol..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTADOR DE RESULTADOS */}
      {!loading && (
        <Text style={styles.resultCount}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
        </Text>
      )}

      {/* LISTA DE USUARIOS */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>
                  {item.name}{" "}
                  <Text style={[styles.role, item.role === 'admin' && styles.adminRole]}>
                    ({item.role ?? "user"})
                  </Text>
                </Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  activeOpacity={0.7}
                  style={styles.actionButton}
                >
                  <Ionicons name="create-outline" size={22} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeUser(item)}
                  activeOpacity={0.7}
                  style={styles.actionButton}
                  disabled={item.id === user?.id} // Deshabilitar si es el propio usuario
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={item.id === user?.id ? "#D1D5DB" : "#DC2626"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>
                  {searchQuery ? "No se encontraron usuarios" : "No hay usuarios para mostrar"}
                </Text>
              </View>
            )
          }
        />
      )}

      {/* MODAL EDITAR */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Editar usuario</Text>

            <TextInput
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.roleLabel}>Rol:</Text>
            <View style={styles.roleSelector}>
              {["user", "admin"].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  onPress={() => setRole(r as "user" | "admin")}
                >
                  <Text
                    style={[
                      styles.roleText,
                      role === r && styles.roleTextActive,
                    ]}
                  >
                    {r === "user" ? "Usuario" : "Administrador"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, (!name || !email) && styles.saveBtnDisabled]}
                onPress={saveEdit}
                disabled={!name || !email}
              >
                <Text style={styles.saveBtnText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
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
import { usersApi, User, UpdateUserDto } from "../../api/users/users.api";
import { useAuth } from "../../hooks/useAuth";
import { styles } from "../styles/panels/user";

export const AdminUsersScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
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
      Alert.alert("Acceso denegado");
      navigation.replace("Home");
    }
  }, [user]);

  /* 
    CARGAR USUARIOS
*/
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
      setFiltered(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* 
    BUSCADOR
  */
  const handleSearch = (text: string) => {
    setSearch(text);
    const q = text.toLowerCase();

    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.role ?? "").toLowerCase().includes(q)
      )
    );
  };

  /* 
    EDITAR
  */
  const openEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole((u.role as "user" | "admin") ?? "user");
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
    } catch {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  /* 
    ELIMINAR
 */
  const removeUser = (u: User) => {
    Alert.alert("Confirmar", `Eliminar a ${u.email}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await usersApi.remove(u.id);
          fetchUsers();
        },
      },
    ]);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* BUSCADOR */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Administrar Usuarios</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>
                  {item.name}{" "}
                  <Text style={styles.role}>({item.role ?? "user"})</Text>
                </Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={22} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeUser(item)}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Roles */}
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
                    {r.toUpperCase()}
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
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

// screens/owner/OwnerSpacesScreen.tsx
import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput,
    Switch,
    ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
    getSpacesByLot,
    createParkingSpace,
    updateParkingSpace,
    deleteParkingSpace,
} from "../../../api/parking/parkings.api";
import { ParkingSpace } from "../../../api/parking/parking-space";

const SPACE_TYPES = ["regular", "discapacitado", "moto", "vip", "electrico"];
const DEFAULT_TYPE = "regular";

const typeColor: Record<string, string> = {
    regular: "#6B7280",
    discapacitado: "#3B82F6",
    moto: "#F59E0B",
    vip: "#8B5CF6",
    electrico: "#10B981",
};

interface SpaceModalProps {
    visible: boolean;
    space?: ParkingSpace | null;
    lotId: string;
    onClose: () => void;
    onSave: (savedSpace: any, isEdit: boolean) => void; // ← tipado
}

const SpaceModal = ({ visible, space, lotId, onClose, onSave }: SpaceModalProps) => {
    const [form, setForm] = useState({
        code: space?.code || "",
        type: space?.type || DEFAULT_TYPE,
        floor: String(space?.floor || 1),
        isActive: space?.isActive ?? true,
    });
    const [loading, setLoading] = useState(false);
    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    React.useEffect(() => {
        setForm({
            code: space?.code || "",
            type: space?.type || DEFAULT_TYPE,
            floor: String(space?.floor || 1),
            isActive: space?.isActive ?? true,
        });
    }, [space, visible]);

    const handleSave = async () => {
        if (!form.code.trim()) { Alert.alert("Error", "El código es requerido"); return; }
        setLoading(true);
        try {
            let result;
            if (space) {
                result = await updateParkingSpace(space.id, {
                    code: form.code.trim().toUpperCase(),
                    type: form.type,
                    floor: Number(form.floor),
                    isActive: form.isActive,
                });
            } else {
                result = await createParkingSpace({
                    lotId,
                    code: form.code.trim().toUpperCase(),
                    type: form.type,
                    floor: Number(form.floor),
                });
            }
            onSave(result, !!space); // ← pasa resultado
            onClose();
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
                <View style={{ backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                            {space ? "Editar espacio" : "Nuevo espacio"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: "600" }}>Código *</Text>
                        <TextInput
                            style={{
                                backgroundColor: "#F9FAFB", borderRadius: 8, borderWidth: 1,
                                borderColor: "#E5E7EB", padding: 12, fontSize: 16,
                                color: "#111827", fontFamily: "monospace", letterSpacing: 2,
                            }}
                            placeholder="Ej: A1"
                            placeholderTextColor="#9CA3AF"
                            value={form.code}
                            onChangeText={v => set("code", v.toUpperCase())}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 8, fontWeight: "600" }}>Tipo</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: "row", gap: 8 }}>
                                {SPACE_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => set("type", type)}
                                        style={{
                                            paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                                            borderWidth: 1.5,
                                            borderColor: form.type === type ? typeColor[type] : "#E5E7EB",
                                            backgroundColor: form.type === type ? `${typeColor[type]}15` : "#FFF",
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 13, fontWeight: "600", textTransform: "capitalize",
                                            color: form.type === type ? typeColor[type] : "#6B7280",
                                        }}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ marginBottom: 14 }}>
                        <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: "600" }}>Piso</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <TouchableOpacity
                                onPress={() => set("floor", String(Math.max(1, Number(form.floor) - 1)))}
                                style={{ backgroundColor: "#F3F4F6", borderRadius: 8, padding: 10 }}
                            >
                                <Ionicons name="remove" size={18} color="#374151" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", minWidth: 30, textAlign: "center" }}>
                                {form.floor}
                            </Text>
                            <TouchableOpacity
                                onPress={() => set("floor", String(Number(form.floor) + 1))}
                                style={{ backgroundColor: "#F3F4F6", borderRadius: 8, padding: 10 }}
                            >
                                <Ionicons name="add" size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {space && (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>Espacio activo</Text>
                            <Switch
                                value={form.isActive}
                                onValueChange={v => set("isActive", v)}
                                trackColor={{ false: "#E5E7EB", true: "#BFDBFE" }}
                                thumbColor={form.isActive ? "#2563EB" : "#9CA3AF"}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={{
                            backgroundColor: loading ? "#9CA3AF" : "#2563EB",
                            borderRadius: 12, padding: 16, alignItems: "center",
                            flexDirection: "row", justifyContent: "center", gap: 8,
                        }}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#FFF" size="small" />
                            : <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                        }
                        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>
                            {loading ? "Guardando..." : (space ? "Guardar cambios" : "Crear espacio")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export const OwnerSpacesScreen = ({ route, navigation }: any) => {
    const { parking } = route.params;
    const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ visible: boolean; space?: ParkingSpace | null }>({ visible: false, space: null });
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [generatingFloor, setGeneratingFloor] = useState<number | null>(null);

    // ── Nombres personalizados de pisos ──────────────────
    const [floorNames, setFloorNames] = useState<Record<number, string>>({});
    const [editingFloor, setEditingFloor] = useState<number | null>(null);
    const [editingFloorName, setEditingFloorName] = useState("");

    const loadSpaces = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getSpacesByLot(parking.id);
            setSpaces(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando espacios:", error);
        } finally {
            setLoading(false);
        }
    }, [parking.id]);

    useFocusEffect(useCallback(() => { loadSpaces(); }, [loadSpaces]));

    const handleDelete = (space: ParkingSpace) => {
        Alert.alert(
            "Eliminar espacio",
            `¿Eliminar el espacio "${space.code}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingId(space.id);
                        try {
                            await deleteParkingSpace(space.id);
                            setSpaces(prev => prev.filter(s => s.id !== space.id));
                        } catch (error: any) {
                            Alert.alert("Error", error.response?.data?.message || "No se pudo eliminar");
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ]
        );
    };

    // ── Genera 1 espacio en orden A1, A2, A3... ──────────
    const handleGenerateSpaces = async (floor: number) => {
        if (generatingFloor !== null) return;
        setGeneratingFloor(floor);
        try {
            const floorLetter = String.fromCharCode(64 + floor);
            const floorSpaces = spaces.filter(s => s.floor === floor);

            // Extrae solo los números de una vez con reduce:
            const maxNum = floorSpaces.reduce((max, s) => {
                const match = s.code.match(new RegExp(`^${floorLetter}(\\d+)$`));
                return match ? Math.max(max, parseInt(match[1], 10)) : max;
            }, 0);
            const code = `${floorLetter}${maxNum + 1}`;
            const newSpace = await createParkingSpace({
                lotId: parking.id, code, type: DEFAULT_TYPE, floor
            });
            // ← actualiza local sin recargar
            setSpaces(prev => [...prev, { ...newSpace, isActive: true }]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo crear el espacio");
        } finally {
            setGeneratingFloor(null);
        }
    };

    // ── Agrega el siguiente piso con 1 espacio ────────────
    const handleAddFloor = async () => {
        if (generatingFloor !== null) return;
        const currentFloors = [...new Set(spaces.map(s => s.floor))];
        const nextFloor = currentFloors.length > 0 ? Math.max(...currentFloors) + 1 : 1;
        const floorLetter = String.fromCharCode(64 + nextFloor);

        setGeneratingFloor(nextFloor);
        try {
            const newSpace = await createParkingSpace({
                lotId: parking.id,
                code: `${floorLetter}1`,
                type: DEFAULT_TYPE,
                floor: nextFloor,
            });
            // ← actualiza local sin recargar
            setSpaces(prev => [...prev, { ...newSpace, isActive: true }]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "No se pudo crear el piso");
        } finally {
            setGeneratingFloor(null);
        }
    };
    // ── Guardar nombre del piso ───────────────────────────
    const handleSaveFloorName = (floor: number) => {
        if (editingFloorName.trim()) {
            setFloorNames(prev => ({ ...prev, [floor]: editingFloorName.trim() }));
        }
        setEditingFloor(null);
        setEditingFloorName("");
    };

    const getFloorLabel = (floor: number) => floorNames[floor] || `Piso ${floor}`;

    const floors = [...new Set(spaces.map(s => s.floor))].sort((a, b) => a - b);
    const activeCount = spaces.filter(s => s.isActive).length;

    const renderSpace = ({ item }: { item: ParkingSpace }) => {
        const isDeleting = deletingId === item.id;
        return (
            <View style={{
                backgroundColor: "#FFF", borderRadius: 10, padding: 12,
                borderWidth: 1.5,
                borderColor: item.isActive ? "#E5E7EB" : "#FEE2E2",
                opacity: isDeleting ? 0.5 : item.isActive ? 1 : 0.7,
                alignItems: "center",
            }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>
                    {item.code}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "600", textTransform: "capitalize", color: typeColor[item.type] || "#6B7280", marginBottom: 6 }}>
                    {item.type}
                </Text>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, backgroundColor: item.isActive ? "#ECFDF5" : "#FEF2F2", marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: item.isActive ? "#10B981" : "#EF4444" }}>
                        {item.isActive ? "ACTIVO" : "INACTIVO"}
                    </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 6 }}>
                    <TouchableOpacity
                        onPress={() => setModal({ visible: true, space: item })}
                        disabled={isDeleting}
                        style={{ backgroundColor: "#EFF6FF", borderRadius: 6, padding: 5 }}
                    >
                        <Ionicons name="pencil-outline" size={14} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDelete(item)}
                        disabled={isDeleting}
                        style={{ backgroundColor: "#FEF2F2", borderRadius: 6, padding: 5 }}
                    >
                        {isDeleting
                            ? <ActivityIndicator size="small" color="#EF4444" />
                            : <Ionicons name="trash-outline" size={14} color="#EF4444" />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            {/* Header */}
            <View style={{
                flexDirection: "row", alignItems: "center",
                paddingHorizontal: 16, paddingVertical: 14,
                backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>Espacios</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>{parking.name}</Text>
                </View>
                <TouchableOpacity
                    style={{ backgroundColor: "#2563EB", borderRadius: 10, padding: 10 }}
                    onPress={() => setModal({ visible: true, space: null })}
                >
                    <Ionicons name="add" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: "row", padding: 16, gap: 10 }}>
                {[
                    { label: "Total", value: spaces.length, color: "#374151" },
                    { label: "Activos", value: activeCount, color: "#10B981" },
                    { label: "Inactivos", value: spaces.length - activeCount, color: "#EF4444" },
                    { label: "Pisos", value: floors.length, color: "#F59E0B" },
                ].map(({ label, value, color }) => (
                    <View key={label} style={{ flex: 1, backgroundColor: "#FFF", borderRadius: 10, padding: 10, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color }}>{value}</Text>
                        <Text style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{label}</Text>
                    </View>
                ))}
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={floors}
                    keyExtractor={item => `floor-${item}`}
                    contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={{ alignItems: "center", padding: 32 }}>
                            <Ionicons name="grid-outline" size={64} color="#D1D5DB" />
                            <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 16 }}>Sin espacios</Text>
                            <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>
                                Agrega tu primer piso para comenzar
                            </Text>
                            <TouchableOpacity
                                onPress={handleAddFloor}
                                style={{ backgroundColor: "#2563EB", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}
                            >
                                <Text style={{ color: "#FFF", fontWeight: "600" }}>Crear primer piso</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    renderItem={({ item: floor }) => {
                        const floorSpaces = spaces.filter(s => s.floor === floor);
                        const isGenerating = generatingFloor === floor;
                        const isEditing = editingFloor === floor;

                        return (
                            <View style={{ backgroundColor: "#FFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#F3F4F6" }}>
                                {/* Cabecera del piso */}
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                                        <Ionicons name="layers-outline" size={16} color="#6B7280" />

                                        {/* Nombre editable inline */}
                                        {isEditing ? (
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}>
                                                <TextInput
                                                    value={editingFloorName}
                                                    onChangeText={setEditingFloorName}
                                                    autoFocus
                                                    style={{
                                                        flex: 1, fontSize: 15, fontWeight: "700", color: "#111827",
                                                        borderBottomWidth: 1.5, borderBottomColor: "#2563EB",
                                                        paddingVertical: 2,
                                                    }}
                                                    onSubmitEditing={() => handleSaveFloorName(floor)}
                                                    returnKeyType="done"
                                                />
                                                <TouchableOpacity onPress={() => handleSaveFloorName(floor)}>
                                                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { setEditingFloor(null); setEditingFloorName(""); }}>
                                                    <Ionicons name="close" size={18} color="#9CA3AF" />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "700", color: "#374151" }}>
                                                    {getFloorLabel(floor)}
                                                </Text>
                                                {/* Lápiz pequeño negro */}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEditingFloor(floor);
                                                        setEditingFloorName(floorNames[floor] || `Piso ${floor}`);
                                                    }}
                                                    style={{ padding: 3 }}
                                                >
                                                    <Ionicons name="pencil-outline" size={13} color="#374151" />
                                                </TouchableOpacity>
                                                <View style={{ backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                                                    <Text style={{ fontSize: 11, color: "#6B7280" }}>{floorSpaces.length} espacios</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Botón Generar — 1 espacio por click */}
                                    {!isEditing && (
                                        <TouchableOpacity
                                            onPress={() => handleGenerateSpaces(floor)}
                                            disabled={isGenerating}
                                            style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingLeft: 8 }}
                                        >
                                            {isGenerating
                                                ? <ActivityIndicator size="small" color="#10B981" />
                                                : <>
                                                    <Ionicons name="add-circle-outline" size={20} color="#10B981" />
                                                    <Text style={{ color: "#10B981", fontWeight: "600", fontSize: 13 }}>Generar</Text>
                                                </>
                                            }
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Grid de espacios */}
                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                    {floorSpaces.map(space => (
                                        <View key={space.id} style={{ width: "22%" }}>
                                            {renderSpace({ item: space })}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    }}
                    ListFooterComponent={
                        floors.length > 0 ? (
                            <TouchableOpacity
                                onPress={handleAddFloor}
                                disabled={generatingFloor !== null}
                                style={{
                                    backgroundColor: "#F9FAFB", borderRadius: 12, padding: 20,
                                    alignItems: "center", justifyContent: "center",
                                    borderWidth: 2, borderColor: "#E5E7EB", borderStyle: "dashed",
                                    marginTop: 8, opacity: generatingFloor !== null ? 0.5 : 1,
                                }}
                            >
                                {generatingFloor === Math.max(...floors) + 1
                                    ? <ActivityIndicator color="#9CA3AF" />
                                    : <>
                                        <Ionicons name="add" size={28} color="#9CA3AF" />
                                        <Text style={{ color: "#6B7280", fontWeight: "600", marginTop: 6, fontSize: 14 }}>
                                            Agregar Piso {Math.max(...floors) + 1}
                                        </Text>
                                    </>
                                }
                            </TouchableOpacity>
                        ) : null
                    }
                />
            )}

            <SpaceModal
                visible={modal.visible}
                space={modal.space}
                lotId={parking.id}
                onClose={() => setModal({ visible: false, space: null })}
                onSave={(savedSpace, isEdit) => {
                    if (isEdit) {
                        // actualiza el espacio editado
                        setSpaces(prev => prev.map(s =>
                            s.id === savedSpace.id ? { ...s, ...savedSpace } : s
                        ));
                    } else {
                        // agrega el nuevo espacio
                        setSpaces(prev => [...prev, { ...savedSpace, isActive: true }]);
                    }
                }}
            />
        </SafeAreaView>
    );
};
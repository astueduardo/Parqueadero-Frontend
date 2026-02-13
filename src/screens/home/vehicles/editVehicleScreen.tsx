import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateVehicle } from "../../../api/vehiculo/vehicles.api";
import { styles } from "../../styles/vehicles/VehicleEdit.styles";

interface ValidationErrors {
    plate_number?: string;
    brand?: string;
    color?: string;
    vehicle_type?: string;
    model?: string;
    year?: string;
}

const VEHICLE_TYPES = [
    { label: "Sedán", icon: "car-outline" },
    { label: "SUV", icon: "car-sport-outline" },
    { label: "Camioneta", icon: "car-outline" },
    { label: "Moto", icon: "bicycle-outline" },
    { label: "Otro", icon: "ellipsis-horizontal-circle-outline" },
];

const COMMON_COLORS = [
    "Blanco", "Negro", "Gris", "Plata", "Rojo",
    "Azul", "Verde", "Amarillo", "Café", "Naranja"
];

export const EditVehicleScreen = ({ navigation, route }: any) => {
    const { vehicle } = route.params;

    const [formData, setFormData] = useState({
        plate_number: vehicle.plate_number || "",
        brand: vehicle.brand || "",
        color: vehicle.color || "",
        model: vehicle.model || "",
        vehicle_type: vehicle.vehicle_type || "",
        year: vehicle.year ? vehicle.year.toString() : "",
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showColorSuggestions, setShowColorSuggestions] = useState(false);
    const [showTypeSuggestions, setShowTypeSuggestions] = useState(false);

    // Validaciones en tiempo real
    const validateField = useCallback((field: string, value: string): string | undefined => {
        switch (field) {
            case "plate_number":
                if (!value.trim()) return "La placa es obligatoria";
                if (value.length < 3) return "Placa demasiado corta";
                if (value.length > 15) return "Placa demasiado larga";
                if (!/^[A-Z0-9-]+$/i.test(value)) return "Solo letras, números y guiones";
                return undefined;

            case "brand":
                if (!value.trim()) return "La marca es obligatoria";
                if (value.length < 2) return "Nombre demasiado corto";
                if (value.length > 50) return "Nombre demasiado largo";
                return undefined;

            case "color":
                if (!value.trim()) return "El color es obligatorio";
                if (value.length < 3) return "Nombre demasiado corto";
                if (value.length > 30) return "Nombre demasiado largo";
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo letras";
                return undefined;

            case "vehicle_type":
                if (!value.trim()) return "El tipo es obligatorio";
                if (value.length < 3) return "Tipo demasiado corto";
                if (value.length > 30) return "Tipo demasiado largo";
                return undefined;

            case "model":
                if (value && value.length > 50) return "Nombre demasiado largo";
                return undefined;

            case "year":
                if (value && value.trim()) {
                    const yearNum = parseInt(value);
                    const currentYear = new Date().getFullYear();
                    if (isNaN(yearNum)) return "Año inválido";
                    if (yearNum < 1900) return "Año muy antiguo";
                    if (yearNum > currentYear + 1) return "Año futuro no válido";
                    if (value.length !== 4) return "Debe tener 4 dígitos";
                }
                return undefined;

            default:
                return undefined;
        }
    }, []);

    const handleChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);

        // Validar solo si el campo ya fue tocado
        if (touched[field]) {
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }

        // Mostrar sugerencias
        if (field === "color" && value.length > 0) {
            setShowColorSuggestions(true);
        } else if (field === "color") {
            setShowColorSuggestions(false);
        }
    }, [touched, validateField]);

    const handleBlur = useCallback((field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field as keyof typeof formData]);
        setErrors(prev => ({ ...prev, [field]: error }));

        // Ocultar sugerencias al perder foco
        if (field === "color") {
            setTimeout(() => setShowColorSuggestions(false), 200);
        }
        if (field === "vehicle_type") {
            setTimeout(() => setShowTypeSuggestions(false), 200);
        }
    }, [formData, validateField]);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        // Validar solo campos obligatorios
        const requiredFields: (keyof typeof formData)[] = ["plate_number", "brand", "color", "vehicle_type"];

        requiredFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field as keyof ValidationErrors] = error;
                isValid = false;
            }
        });

        // Validar campos opcionales si tienen valor
        if (formData.model) {
            const modelError = validateField("model", formData.model);
            if (modelError) {
                newErrors.model = modelError;
                isValid = false;
            }
        }

        if (formData.year) {
            const yearError = validateField("year", formData.year);
            if (yearError) {
                newErrors.year = yearError;
                isValid = false;
            }
        }

        setErrors(newErrors);
        setTouched({
            plate_number: true,
            brand: true,
            color: true,
            vehicle_type: true,
            model: true,
            year: true,
        });

        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert(
                "Campos incompletos",
                "Por favor corrige los errores antes de continuar.",
                [{ text: "Entendido" }]
            );
            return;
        }

        if (!hasChanges) {
            Alert.alert(
                "Sin cambios",
                "No has realizado ningún cambio.",
                [{ text: "OK" }]
            );
            return;
        }

        Alert.alert(
            "Confirmar cambios",
            "¿Deseas guardar los cambios realizados?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Guardar",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await updateVehicle(vehicle.id, {
                                plate_number: formData.plate_number.trim().toUpperCase(),
                                brand: formData.brand.trim(),
                                model: formData.model.trim() || undefined,
                                color: formData.color.trim(),
                                vehicle_type: formData.vehicle_type.trim(),
                                year: formData.year ? parseInt(formData.year) : undefined,
                            });

                            Alert.alert(
                                "¡Actualizado!",
                                "Los cambios se guardaron correctamente.",
                                [{ text: "OK", onPress: () => navigation.goBack() }]
                            );
                        } catch (err: any) {
                            const errorMessage = err.response?.data?.message ||
                                "No se pudo actualizar el vehículo. Verifica tu conexión.";
                            Alert.alert("Error", errorMessage);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleCancel = () => {
        if (hasChanges) {
            Alert.alert(
                "¿Descartar cambios?",
                "Tienes cambios sin guardar. ¿Deseas salir de todas formas?",
                [
                    { text: "Continuar editando", style: "cancel" },
                    { text: "Descartar", style: "destructive", onPress: () => navigation.goBack() },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    const selectColor = (color: string) => {
        handleChange("color", color);
        setShowColorSuggestions(false);
    };

    const selectVehicleType = (type: string) => {
        handleChange("vehicle_type", type);
        setShowTypeSuggestions(false);
    };

    const renderInput = (
        field: keyof typeof formData,
        label: string,
        placeholder: string,
        icon: string,
        options: {
            keyboardType?: "default" | "numeric";
            autoCapitalize?: "none" | "sentences" | "words" | "characters";
            maxLength?: number;
            required?: boolean;
        } = {}
    ) => {
        const hasError = touched[field] && errors[field as keyof ValidationErrors];
        const hasValue = formData[field].length > 0;

        return (
            <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>
                        {label} {options.required && <Text style={styles.required}>*</Text>}
                    </Text>
                    {hasError && (
                        <Text style={styles.errorText}>{errors[field as keyof ValidationErrors]}</Text>
                    )}
                </View>

                <View style={[
                    styles.inputWrapper,
                    hasError && styles.inputWrapperError,
                    hasValue && !hasError && styles.inputWrapperFilled
                ]}>
                    <Ionicons
                        name={icon as any}
                        size={20}
                        color={hasError ? "#EF4444" : hasValue ? "#2563EB" : "#6B7280"}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        placeholder={placeholder}
                        value={formData[field]}
                        onChangeText={(value) => handleChange(field, value)}
                        onBlur={() => handleBlur(field)}
                        onFocus={() => {
                            if (field === "vehicle_type") setShowTypeSuggestions(true);
                        }}
                        style={styles.input}
                        editable={!loading}
                        keyboardType={options.keyboardType}
                        autoCapitalize={options.autoCapitalize}
                        maxLength={options.maxLength}
                        placeholderTextColor="#9CA3AF"
                    />
                    {hasValue && !loading && (
                        <TouchableOpacity
                            onPress={() => handleChange(field, "")}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={styles.backButton}
                        disabled={loading}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={28} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Vehículo</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* FORMULARIO */}
                <ScrollView
                    contentContainerStyle={styles.form}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {renderInput("plate_number", "Placa", "ABC-1234", "card-outline", {
                        autoCapitalize: "characters",
                        maxLength: 15,
                        required: true,
                    })}

                    {renderInput("brand", "Marca", "Toyota, Chevrolet, etc.", "business-outline", {
                        maxLength: 50,
                        required: true,
                    })}

                    {renderInput("model", "Modelo", "Corolla, Spark, etc.", "car-outline", {
                        maxLength: 50,
                    })}

                    {/* Color con sugerencias */}
                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>
                                Color <Text style={styles.required}>*</Text>
                            </Text>
                            {touched.color && errors.color && (
                                <Text style={styles.errorText}>{errors.color}</Text>
                            )}
                        </View>

                        <View style={[
                            styles.inputWrapper,
                            touched.color && errors.color && styles.inputWrapperError,
                            formData.color.length > 0 && !errors.color && styles.inputWrapperFilled
                        ]}>
                            <Ionicons
                                name="color-palette-outline"
                                size={20}
                                color={errors.color ? "#EF4444" : formData.color ? "#2563EB" : "#6B7280"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Rojo, Azul, Negro, etc."
                                value={formData.color}
                                onChangeText={(value) => handleChange("color", value)}
                                onBlur={() => handleBlur("color")}
                                onFocus={() => setShowColorSuggestions(true)}
                                style={styles.input}
                                editable={!loading}
                                maxLength={30}
                                placeholderTextColor="#9CA3AF"
                            />
                            {formData.color.length > 0 && !loading && (
                                <TouchableOpacity
                                    onPress={() => handleChange("color", "")}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Sugerencias de colores */}
                        {showColorSuggestions && (
                            <View style={styles.suggestionsContainer}>
                                <Text style={styles.suggestionsTitle}>Colores comunes:</Text>
                                <View style={styles.suggestionsGrid}>
                                    {COMMON_COLORS.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={styles.suggestionChip}
                                            onPress={() => selectColor(color)}
                                        >
                                            <Text style={styles.suggestionText}>{color}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Tipo de vehículo con sugerencias */}
                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>
                                Tipo de vehículo <Text style={styles.required}>*</Text>
                            </Text>
                            {touched.vehicle_type && errors.vehicle_type && (
                                <Text style={styles.errorText}>{errors.vehicle_type}</Text>
                            )}
                        </View>

                        <View style={[
                            styles.inputWrapper,
                            touched.vehicle_type && errors.vehicle_type && styles.inputWrapperError,
                            formData.vehicle_type.length > 0 && !errors.vehicle_type && styles.inputWrapperFilled
                        ]}>
                            <Ionicons
                                name="options-outline"
                                size={20}
                                color={errors.vehicle_type ? "#EF4444" : formData.vehicle_type ? "#2563EB" : "#6B7280"}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                placeholder="Sedán, SUV, Pickup, etc."
                                value={formData.vehicle_type}
                                onChangeText={(value) => handleChange("vehicle_type", value)}
                                onBlur={() => handleBlur("vehicle_type")}
                                onFocus={() => setShowTypeSuggestions(true)}
                                style={styles.input}
                                editable={!loading}
                                maxLength={30}
                                placeholderTextColor="#9CA3AF"
                            />
                            {formData.vehicle_type.length > 0 && !loading && (
                                <TouchableOpacity
                                    onPress={() => handleChange("vehicle_type", "")}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Sugerencias de tipos */}
                        {showTypeSuggestions && (
                            <View style={styles.typeSuggestionsContainer}>
                                {VEHICLE_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.label}
                                        style={styles.typeSuggestionItem}
                                        onPress={() => selectVehicleType(type.label)}
                                    >
                                        <Ionicons name={type.icon as any} size={24} color="#2563EB" />
                                        <Text style={styles.typeSuggestionText}>{type.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {renderInput("year", "Año", "2020", "calendar-outline", {
                        keyboardType: "numeric",
                        maxLength: 4,
                    })}

                    {/* Botones */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={styles.saveButtonText}>Guardando...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.requiredNote}>* Campos obligatorios</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
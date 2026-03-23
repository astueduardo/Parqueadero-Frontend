// screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import {
    validateEmail,
    validatePassword,
    validateRequired,
    validatePasswordMatch
} from '../../utils/validators.Login.register';
import { showError, showSuccess } from '../../utils/alerts.Login.Register';
import { createRegisterStyles } from '../../styles/auth/ScreenRegister.style';

const { height } = Dimensions.get('window');

interface RegisterScreenProps {
    navigation: any;
}

interface FormData {
    name: string;
    username: String;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    username?: String
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const { register, isLoading: authLoading } = useAuth();
    const { colors, isDark } = useTheme();
    const styles = createRegisterStyles(colors);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const isButtonDisabled = loading || authLoading;

    const handleChange = (field: keyof FormData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleBlur = (field: keyof FormData) => () => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field: keyof FormData): boolean => {
        let errorMessage = '';

        switch (field) {
            case 'name':
                if (!validateRequired(formData.name)) {
                    errorMessage = 'El nombre es requerido';
                }
                break;
            case 'username':
                if (!validateRequired(formData.username)) {
                    errorMessage = 'El apodo es requerido';
                }
                break;
            case 'email':
                if (!validateRequired(formData.email)) {
                    errorMessage = 'El email es requerido';
                } else if (!validateEmail(formData.email)) {
                    errorMessage = 'Ingresa un email válido';
                }
                break;
            case 'password':
                if (!validateRequired(formData.password)) {
                    errorMessage = 'La contraseña es requerida';
                } else if (!validatePassword(formData.password)) {
                    errorMessage = 'Mínimo 6 caracteres';
                }
                break;
            case 'confirmPassword':
                if (!validateRequired(formData.confirmPassword)) {
                    errorMessage = 'Confirma tu contraseña';
                } else if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
                    errorMessage = 'Las contraseñas no coinciden';
                }
                break;
        }

        setErrors(prev => ({ ...prev, [field]: errorMessage }));
        return !errorMessage;
    };

    const validateForm = (): boolean => {
        const fields: (keyof FormData)[] = ['name', 'username', 'email', 'password', 'confirmPassword'];
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    };

    const handleRegister = async () => {
        const allTouched = {
            name: true,
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        };
        setTouched(allTouched);

        if (!validateForm() || isButtonDisabled) {
            return;
        }

        setLoading(true);
        try {
            await register(
                formData.name,
                formData.username,
                formData.email,
                formData.password,
                formData.confirmPassword
            );

            showSuccess('¡Registro exitoso! Bienvenido a la aplicación');

            setTimeout(() => {
                navigation.navigate('Login');
            }, 1500);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Error al registrarse';
            showError(errorMessage);
            console.error('Register error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginPress = () => {
        if (!isButtonDisabled) {
            navigation.navigate('Login');
        }
    };

    const renderInput = (
        field: keyof FormData,
        placeholder: string,
        options?: {
            secureTextEntry?: boolean;
            keyboardType?: 'email-address' | 'default';
            autoCapitalize?: 'none' | 'words';
        }
    ) => {
        const hasError = touched[field] && errors[field];

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>
                    {field === 'name' && 'Nombre Completo'}
                    {field === 'username' && 'Apodo'}
                    {field === 'email' && 'Email'}
                    {field === 'password' && 'Contraseña'}
                    {field === 'confirmPassword' && 'Confirmar Contraseña'}
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        hasError && styles.inputError
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={formData[field]}
                    onChangeText={handleChange(field)}
                    onBlur={handleBlur(field)}
                    secureTextEntry={options?.secureTextEntry}
                    keyboardType={options?.keyboardType || 'default'}
                    autoCapitalize={options?.autoCapitalize || 'none'}
                    editable={!isButtonDisabled}
                />

                {hasError && (
                    <Text style={styles.errorText}>
                        {errors[field]}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={colors.header}
            />

            {/* Header con altura proporcional */}
            <View style={[styles.header, { height: height * 0.18 }]}>
                <View style={styles.logoContainer}>
                    <Text style={styles.appName}>ParkEasy</Text>
                    <Text style={styles.joinUs}>Únete a nuestra comunidad</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formWrapper}>
                    <View style={styles.formContainer}>
                        {renderInput('name', 'Puede ser un nombre y un apellido', { autoCapitalize: 'words' })}
                        {renderInput('username', 'Un apodo', { autoCapitalize: 'words' })}
                        {renderInput('email', 'correo@ejemplo.com', { keyboardType: 'email-address' })}
                        {renderInput('password', 'Mínimo 6 caracteres', { secureTextEntry: true })}
                        {renderInput('confirmPassword', 'Repite tu contraseña', { secureTextEntry: true })}

                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                isButtonDisabled && styles.registerButtonDisabled,
                            ]}
                            onPress={handleRegister}
                            disabled={isButtonDisabled}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLoginPress}
                            disabled={isButtonDisabled}
                            style={styles.linkContainer}
                        >
                            <Text style={styles.loginLink}>
                                ¿Ya tienes cuenta?{' '}
                                <Text style={styles.loginLinkBold}>Inicia sesión</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
// screens/auth/LoginScreen.tsx
import React, { useState } from "react";
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
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { useAuth } from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../utils/validators.Login.register";
import { showError } from "../../utils/alerts.Login.Register";
import { REDIRECT_URI } from "../../utils/config";
import { useTheme } from "../../context/ThemeContext";
import { createLoginStyles } from "../../styles/auth/ScreenLogin.style";

const { height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, loginWithGoogle, isLoading: authLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = createLoginStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = loading || authLoading;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "468037003282-jrfk3jmk9hpmq5525snuq68up8anb2eg.apps.googleusercontent.com",
    iosClientId: "468037003282-jrfk3jmk9hpmq5525snuq68up8anb2eg.apps.googleusercontent.com",
    webClientId: "468037003282-9sgvb02374hn9m1hc5uh05djligqbblp.apps.googleusercontent.com",
    responseType: "id_token",
    scopes: ["profile", "email"],
    redirectUri: REDIRECT_URI,
  });
  React.useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        response.authentication?.idToken || (response.params as any)?.id_token;
      if (idToken) {
        handleGoogleSignIn(idToken);
      }
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    if (isButtonDisabled) return;
    setLoading(true);
    try {
      await loginWithGoogle(idToken);
    } catch (error: any) {
      showError(error?.message || "Error al iniciar con Google");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!validateEmail(email)) {
      showError("Por favor ingresa un email válido");
      return false;
    }
    if (!validatePassword(password)) {
      showError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm() || isButtonDisabled) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      showError(error?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = () => {
    if (!request || isButtonDisabled) {
      showError("Error al configurar Google Sign-In");
      return;
    }
    promptAsync();
  };

  const handleRegisterPress = () => {
    if (!isButtonDisabled) {
      navigation.navigate("Register");
    }
  };

  // Componente para el logo de Google con colores oficiales
  const GoogleLogo = () => (
    <View style={styles.googleLogoContainer}>
      <Text style={[styles.googleLetter, { color: '#4285F4' }]}>G</Text>
      <Text style={[styles.googleLetter, { color: '#EA4335' }]}>o</Text>
      <Text style={[styles.googleLetter, { color: '#FBBC05' }]}>o</Text>
      <Text style={[styles.googleLetter, { color: '#4285F4' }]}>g</Text>
      <Text style={[styles.googleLetter, { color: '#34A853' }]}>l</Text>
      <Text style={[styles.googleLetter, { color: '#EA4335' }]}>e</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.header}
      />

      {/* Header con altura proporcional */}
      <View style={[styles.header, { height: height * 0.2 }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>ParkEasy</Text>
          <Text style={styles.welcomeBack}>Bienvenido de vuelta</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formWrapper}>
          <View style={styles.formContainer}>
            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isButtonDisabled}
            />

            {/* Password Input */}
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isButtonDisabled}
            />
            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isButtonDisabled && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isButtonDisabled}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>



            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O continúa con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button - CON LOGO CORREGIDO */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGooglePress}
              disabled={isButtonDisabled}
              activeOpacity={0.7}
            >
              <View style={styles.googleButtonContent}>
                <GoogleLogo />
                <Text style={styles.googleButtonText}>
                  Sign in with Google
                </Text>
              </View>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity
              onPress={handleRegisterPress}
              disabled={isButtonDisabled}
              style={styles.linkContainer}
            >
              <Text style={styles.registerLink}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.registerLinkBold}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
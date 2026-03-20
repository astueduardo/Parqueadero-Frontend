// styles/auth/ScreenLogin.style.ts
import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../utils/theme";

const { height, width } = Dimensions.get('window');

export const createLoginStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.header,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    maxHeight: 200,
    // Sombra para el header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  logoContainer: {
    alignItems: 'center',
  },

  appName: {
    color: colors.textLight,
    fontSize: width > 400 ? 32 : 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: 'center',
  },

  welcomeBack: {
    color: colors.textLight,
    fontSize: width > 400 ? 18 : 16,
    opacity: 0.9,
    textAlign: 'center',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16, // Más redondeado
    padding: 24,
    // Sombra más pronunciada para profundidad
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1.5, // Borde más grueso
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    // Sombra sutil en inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  forgotContainer: {
    alignItems: 'flex-end', //ala derecha
    marginTop: 12,        // Espacio después del botón
    marginBottom: 16,     // Espacio antes del divider
  },

  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para dar profundidad
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  loginButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0.1,
  },

  loginButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    color: colors.textMuted,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  googleButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16, // Altura cómoda
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginBottom: 20,
    // Sombra para profundidad (como la tenemos)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  googleButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  // Contenedor para el logo de Google
  googleLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  googleLetter: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 0.5,
  },

  linkContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  registerLink: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
  },

  registerLinkBold: {
    fontWeight: '600',
    color: colors.success,
  },
});
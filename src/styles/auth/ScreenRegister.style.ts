// styles/auth/ScreenRegister.style.ts
import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../utils/theme";

const { height, width } = Dimensions.get('window');

export const createRegisterStyles = (colors: Theme['colors']) => StyleSheet.create({
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
        maxHeight: 180,
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

    joinUs: {
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
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: height * 0.02,
    },

    inputContainer: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },

    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.background,
    },

    inputError: {
        borderColor: colors.error,
    },

    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },

    registerButton: {
        backgroundColor: colors.success,
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    registerButtonDisabled: {
        backgroundColor: colors.disabled,
    },

    registerButtonText: {
        color: colors.textLight,
        fontSize: 16,
        fontWeight: '600',
    },

    // 👈 CORREGIDO: Cambié loginLinkContainer por linkContainer
    linkContainer: {
        paddingVertical: 16,
        alignItems: 'center',
    },

    loginLink: {
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 15,
    },

    loginLinkBold: {
        fontWeight: '600',
        color: colors.primary,
    },
});
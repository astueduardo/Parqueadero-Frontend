// styles/home/HomeScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../utils/theme";

const { width } = Dimensions.get('window');

export const createHomeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.header,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  appName: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "700",
  },

  greeting: {
    color: colors.textLight,
    fontSize: 16,
    marginTop: 4,
  },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: colors.card,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarText: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 18,
  },

  content: {
    padding: 20,
  },

  welcomeSection: {
    marginBottom: 24,
  },

  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    //para poner pading en top
    marginTop: width > 515 ? 20 : 5,
    padding: width > 300 ? 50 : 40,
    marginBottom: 20,
    borderWidth: 2,
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 22,
  },

  cardText: {
    marginLeft: 16,
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },

  quickInfoSection: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },

  infoCardsContainer: {
    flexDirection: "row",
    gap: 12,
  },

  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  infoCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  infoCardTitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },

  infoCardValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginTop: 4,
    textAlign: "center",
  },

  // Mantenemos estos por si acaso
  ratesContainer: {
    flexDirection: "row",
    gap: 12,
  },

  rateCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  rateLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },

  ratePrice: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
    color: colors.text,
  },
});
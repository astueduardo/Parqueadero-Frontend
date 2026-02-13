import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  greeting: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 4,
  },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontWeight: "700",
    color: "#1F2937",
  },

  content: {
    padding: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 40,
    marginBottom: 20,
    borderWidth: 2.0,
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
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginVertical: 16,
  },

  ratesContainer: {
    flexDirection: "row",
    gap: 12,
  },

  rateCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  rateLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  ratePrice: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
    color: "#111827",
  },
});

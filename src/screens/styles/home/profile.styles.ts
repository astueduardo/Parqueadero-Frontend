import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    backgroundColor: "#2563EB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  content: { padding: 16 },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  userRow: { flexDirection: "row", gap: 16, marginBottom: 16 },

  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  name: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtext: { color: "#6B7280", marginTop: 4 },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  infoValue: { fontSize: 14, color: "#111827", fontWeight: "600" },

  outlineBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineText: { color: "#2563EB", fontWeight: "600" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionLeft: { flexDirection: "row", gap: 12 },
  optionText: { fontSize: 14, color: "#111827" },

  link: {
    color: "#2563EB",
    paddingVertical: 6,
    fontWeight: "600",
  },

  logoutBtn: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 14,
    marginBottom: 20,
  },
  logoutText: { color: "#DC2626", fontWeight: "700" },

  footer: { alignItems: "center", gap: 4 },
  footerText: { fontSize: 12, color: "#6B7280" },
});

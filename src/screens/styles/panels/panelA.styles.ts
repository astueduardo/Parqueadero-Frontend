import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  createBtn: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 12,
  },

  /* ================= SEARCH ================= */
  searchBox: {
    marginBottom: 12,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  /* ================= MODAL ================= */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  roleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    marginHorizontal: 4,
  },

  roleBtnActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  roleText: {
    color: "#374151",
    fontWeight: "600",
  },

  roleTextActive: {
    color: "#FFFFFF",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  cancel: {
    color: "#6B7280",
    fontWeight: "600",
  },

  save: {
    color: "#2563EB",
    fontWeight: "700",
  },

  /* ================= DASHBOARD CARDS ================= */
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  cardText: {
    fontSize: 14,
    color: "#6B7280",
  },

  /* ================= LOGOUT ================= */
  logout: {
    marginTop: 24,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

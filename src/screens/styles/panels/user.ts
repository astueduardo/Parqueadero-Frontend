import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  role: {
    marginTop: 5,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  roleBtn: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    marginRight: 30, // Compensa el back button
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

  cancelBtn: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  backBtn: {
    marginRight: 10,
    padding: 4,
  },
});

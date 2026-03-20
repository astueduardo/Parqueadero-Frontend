import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  infoBox: {
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  infoSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  grid: {
    paddingVertical: 10,
    gap: 12,
  },

  spaceBox: {
    width: "22%",
    height: 60,
    borderRadius: 10,
    margin: "1.5%",
    justifyContent: "center",
    alignItems: "center",
  },

  spaceText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 14,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#374151",
  },

  nextBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  nextBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },

  nextBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

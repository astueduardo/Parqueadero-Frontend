import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
  },

  /* Ubicación */
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  locationValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* Search */
  searchRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Count */
  count: {
    marginVertical: 12,
    margin: 12,
    color: "#6B7280",
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    margin: 12
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 15,
  },
  address: {
    color: "#6B7280",
    fontSize: 12,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#374151",
  },
  price: {
    marginLeft: "auto",
    color: "#2563EB",
    fontWeight: "600",
  },

  available: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 13,
  },
  total: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginTop: 6,
  },
  progressFill: {
    height: 6,
    borderRadius: 4,
  },


  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

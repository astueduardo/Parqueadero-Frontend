// styles/parking/ParkingList.styles.ts
import { StyleSheet } from "react-native";
import { Theme } from "../../utils/theme";

export const createParkingListStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

  },

  header: {
    flexDirection: "row",
    alignItems: "center", // 👈 ESTO ES CLAVE
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },

  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },

  countText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  listContent: {
    paddingBottom: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
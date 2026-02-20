// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ParkingListScreen } from "../screens/parking/listparkings/ParkingListScreen";
import { ParkingDetailScreen } from "../screens/parking/ParkingDetailScreen";
import { HistoryScreen } from "../screens/History/HistoryScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { AdminHomeScreen } from "../screens/admin/AdminScreen";
import { ReservationFormScreen } from "../screens/parking/listparkings/frorms.persona"
import { VehicleListScreen } from "../screens/home/vehicles/RegistroVheicles"
import { CreateVehicleScreen } from "../screens/home/vehicles/createVehicleScreen"
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { AdminUsersScreen } from "../screens/admin/AdminUsersScreen";
import { EditVehicleScreen } from "../screens/home/vehicles/editVehicleScreen";
const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ParkingList" component={ParkingListScreen} />
      <Stack.Screen name="ParkingDetail" component={ParkingDetailScreen} />
      <Stack.Screen name="ReservationForm" component={ReservationFormScreen} />
      <Stack.Screen name="Vehicles" component={VehicleListScreen} />
      <Stack.Screen name="CreateVehicle" component={CreateVehicleScreen} />
      <Stack.Screen name="EditVehicle" component={EditVehicleScreen} options={{ title: 'Editar Vehículo' }} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

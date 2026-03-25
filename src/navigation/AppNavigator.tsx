import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ParkingListScreen } from "../screens/parking/listparkings/ParkingListScreen";
import { ParkingDetailScreen } from "../screens/parking/parkingDetal/ParkingDetailScreen";
import { HistoryScreen } from "../screens/History/HistoryScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { AdminHomeScreen } from "../screens/operators/SuperAdmin/SuperAdminScreen";
import { VehicleListScreen } from "../screens/home/vehicles/RegistroVheicles";
import { CreateVehicleScreen } from "../screens/home/vehicles/createVehicleScreen";
import { AdminUsersScreen } from "../screens/operators/SuperAdmin/SuperAdminUsersScreen";
import { EditVehicleScreen } from "../screens/home/vehicles/editVehicleScreen";
import { useAuth } from "../hooks/useAuth";
import { ReservationFormScreen } from "../components/forms/frorms.persona";
import { ReservationSuccessScreen } from "../screens/parking/ReservationSuccessScreen";
// ── Owner screens (nuevas)
import { OwnerHomeScreen } from "../screens/operators/Owner/OwnerHomeScreen";
import { OwnerParkingDetailScreen } from "../screens/operators/Owner/OwnerParkingDetailScreen";
import { OwnerCreateParkingScreen } from "../screens/operators/Owner/OwnerCreateParkingScreen";
import { OwnerEditParkingScreen } from "../screens/operators/Owner/OwnerEditParkingScreen";
import { OwnerSpacesScreen } from "../screens/operators/Owner/OwnerSpacesScreen";
import { OperatorHomeScreen } from "../screens/operators/Owner/Validator/operator";
import { QrScannerScreen } from "../screens/qr/QrScannerScreen";
import { PaymentScreen } from "../screens/payments/PaymentScreen";
import { PaymentSuccessScreen } from "../screens/payments/PaymentSuccessScreen";


export type AppStackParamList = {
  Home: undefined;
  ParkingList: undefined;
  ParkingDetail: { parking: any };
  ReservationForm: { parking: any; space: any };
  ReservationSuccess: { reservation: any; parking: any; space: any; total: number; arrivalTime: string; departureTime: string };
  Vehicles: undefined;
  QRGenerator: { reservationId: string };
  CreateVehicle: undefined;
  OperatorHome: undefined;
  EditVehicle: { vehicleId: string };
  History: undefined;
  Profile: undefined;
  Payment: { reservation: any; parking: any; total: number };
  PaymentSuccess: { reservation: any; parking: any; total: number; paymentIntentId: string };

};

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminUsers: undefined;
};

export type OperatorStackParamList = {
  OperatorHome: undefined;
  QrScanner: undefined;
  QrValidate: { reservationId: string };
};

export type OwnerStackParamList = {
  OwnerHome: undefined;
  OwnerParkingDetail: { parkingId: string };
  OwnerCreateParking: undefined;
  OwnerEditParking: { parking: any };
  OwnerSpaces: { parking: any };
};

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const OwnerStack = createNativeStackNavigator<OwnerStackParamList>();
const OperatorStack = createNativeStackNavigator<OperatorStackParamList>();

const AdminNavigator = () => (
  <AdminStack.Navigator screenOptions={{ headerShown: false }}>
    <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} />
    <AdminStack.Screen name="AdminUsers" component={AdminUsersScreen} />
  </AdminStack.Navigator>
);

const OperatorNavigator = () => (
  <OperatorStack.Navigator screenOptions={{ headerShown: false }}>
    <OperatorStack.Screen name="OperatorHome" component={OperatorHomeScreen} />
    <OperatorStack.Screen name="QrScanner" component={QrScannerScreen} />
  </OperatorStack.Navigator>
);

const OwnerNavigator = () => (
  <OwnerStack.Navigator screenOptions={{ headerShown: false }}>
    <OwnerStack.Screen name="OwnerHome" component={OwnerHomeScreen} />

    <OwnerStack.Screen name="OwnerParkingDetail" component={OwnerParkingDetailScreen} />
    <OwnerStack.Screen name="OwnerCreateParking" component={OwnerCreateParkingScreen} />
    <OwnerStack.Screen name="OwnerEditParking" component={OwnerEditParkingScreen} />
    <OwnerStack.Screen name="OwnerSpaces" component={OwnerSpacesScreen} />
  </OwnerStack.Navigator>

);

const UserNavigator = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="Home" component={HomeScreen} />
    <AppStack.Screen name="ParkingList" component={ParkingListScreen} />
    <AppStack.Screen name="ParkingDetail" component={ParkingDetailScreen} />
    <AppStack.Screen name="ReservationForm" component={ReservationFormScreen} />
    <AppStack.Screen name="ReservationSuccess" component={ReservationSuccessScreen} />
    <AppStack.Screen name="Vehicles" component={VehicleListScreen} />
    <AppStack.Screen name="CreateVehicle" component={CreateVehicleScreen} />
    <AppStack.Screen name="EditVehicle" component={EditVehicleScreen} />
    <AppStack.Screen name="History" component={HistoryScreen} />
    <AppStack.Screen name="Profile" component={ProfileScreen} />
    <AppStack.Screen name="Payment" component={PaymentScreen} />
    <AppStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
  </AppStack.Navigator>
);

export const AppNavigator = () => {
  const { user } = useAuth();

  if (user?.role === "admin") return <AdminNavigator />;
  if (user?.role === "owner") return <OwnerNavigator />;
  if (user?.role === "operator") return <OperatorNavigator />; // ← nuevo
  return <UserNavigator />;
};

export default AppNavigator;
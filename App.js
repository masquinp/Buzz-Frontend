import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

/* REDUCERS */
import user from "./reducers/users";
import rides from "./reducers/rides";
import profile from "./reducers/profile";
import review from "./reducers/review";

/* EXISTING SCREENS */
import HomeScreen from "./screens/HomeScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatScreen from "./screens/ChatScreen";
import MapScreen from "./screens/MapScreen";
import ReviewScreen from "./screens/ReviewScreen";
import AllRidesScreen from "./screens/AllRidesScreen";
import DriverHomeScreen from "./screens/DriverHomeScreen";
import AddRideScreen from "./screens/AddRideScreen";
import PaymentScreen from "./screens/PaymentScreen";
import AddPaymentMethodScreen from "./screens/AddPaymentMethodScreen";

/* NEW PASSENGER FLOW */
import PassengerHomeScreen from "./screens/PassengerHomeScreen";
import RideSummaryScreen from "./screens/RideSummaryScreen";
import BookingConfirmedScreen from "./screens/BookingConfirmedScreen";

/* NEW DRIVER FLOW */
import DriverTripDetailsScreen from "./screens/DriverTripDetailsScreen";
import DriverQrScannerScreen from "./screens/DriverQrScannerScreen";
import DriverTripInProgressScreen from "./screens/DriverTripInProgressScreen";
import DriverTripCompletedScreen from "./screens/DriverTripCompletedScreen";

/* OTHER */
import MyridesScreen from "./screens/MyridesScreen";

const store = configureStore({
  reducer: { user, rides, profile, review },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Chat") {
            iconName = "comments";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#A7333F",
        tabBarInactiveTintColor: "#335561",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    >
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}
            >
              {/* AUTH / HOME */}
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Connection" component={ConnectionScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />

              {/* TAB NAV */}
              <Stack.Screen name="TabNavigator" component={TabNavigator} />

              {/* EXISTING */}
              <Stack.Screen
                name="AddPaymentMethod"
                component={AddPaymentMethodScreen}
              />
              <Stack.Screen name="AllRides" component={AllRidesScreen} />
              <Stack.Screen name="Review" component={ReviewScreen} />
              <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
              <Stack.Screen name="AddRide" component={AddRideScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="MyRides" component={MyridesScreen} />
              <Stack.Screen name="Messages" component={ChatScreen} />

              {/* PASSENGER FLOW */}
              <Stack.Screen
                name="PassengerHome"
                component={PassengerHomeScreen}
              />
              <Stack.Screen name="RideSummary" component={RideSummaryScreen} />
              <Stack.Screen
                name="BookingConfirmed"
                component={BookingConfirmedScreen}
              />

              {/* DRIVER FLOW */}
              <Stack.Screen
                name="DriverTripDetails"
                component={DriverTripDetailsScreen}
              />
              <Stack.Screen
                name="DriverQrScanner"
                component={DriverQrScannerScreen}
              />
              <Stack.Screen
                name="DriverTripInProgress"
                component={DriverTripInProgressScreen}
              />
              <Stack.Screen
                name="DriverTripCompleted"
                component={DriverTripCompletedScreen}
              />

              {/* SETTINGS TEMPORAIRE */}
              <Stack.Screen name="Settings" component={ProfileScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </StripeProvider>
  );
}
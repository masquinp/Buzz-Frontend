import React from "react";

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
import payments from "./reducers/payment";
import bookings from "./reducers/bookings";
import messages from "./reducers/messages";

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
import BookingScreen from "./screens/BookingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ConfirmationPaymentScreen from "./screens/ConfirmationPaymentScreen";
import AddReviewScreen from "./screens/AddReviewScreen";
import MessagesScreen from "./screens/MessagesScreen";

/* OTHER */
import MyridesScreen from "./screens/MyridesScreen";

const store = configureStore({
  reducer: { user, rides, profile, review, bookings, payments, messages },
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
          } else if (route.name === "Messages") {
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
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
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
            <Stack.Screen name="AllRides" component={AllRidesScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Driver" component={DriverHomeScreen} />
            <Stack.Screen name="AddRide" component={AddRideScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MyRide" component={MyridesScreen} />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen
              name="ConfirmationPayment"
              component={ConfirmationPaymentScreen}
            />
            <Stack.Screen name="AddReview" component={AddReviewScreen} />
            {/* <Stack.Screen name="Conversations" component={ConversationsScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

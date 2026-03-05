import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ConnectionScreen from "./screens/ConnectionScreen";
import RegisterScreen from "./screens/RegisterScreen";

import HomeScreen from "./screens/HomeScreen";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import ProfileScreen from "./screens/ProfileScreen";
import ChatScreen from "./screens/ChatScreen";

import { StripeProvider } from "@stripe/stripe-react-native";

import MapScreen from "./screens/MapScreen";
import RideScreen from "./screens/RideScreen";
import ReviewScreen from "./screens/ReviewScreen";
import TestScreen from "./screens/TestScreen";
import DriverScreen from "./screens/DriverScreen";
import BookingsScreen from "./screens/BookingsScreen";
import AddRideScreen from "./screens/AddRideScreen";

import user from "./reducers/users";
import rides from './reducers/rides';
import profile from './reducers/profile';
import review from './reducers/review';

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

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
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Connection" component={ConnectionScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />

            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            {/* <Stack.Screen name="Map" component={MapScreen} /> */}
            <Stack.Screen name="Ride" component={RideScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
            <Stack.Screen name="Driver" component={DriverScreen} />
            <Stack.Screen name="Bookings" component={BookingsScreen} />
            <Stack.Screen name="AddRide" component={AddRideScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

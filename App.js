import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HomeScreen from "./screens/HomeScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MapScreen from "./screens/MapScreen";
import RideScreen from "./screens/RideScreen";
import ReviewScreen from "./screens/ReviewScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TestScreen from "./screens/TestScreen";
import ChatScreen from "./screens/ChatScreen";
import DriverScreen from "./screens/DriverScreen";


import user from "./reducers/users";
import rides from './reducers/rides';

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: { user, rides },
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

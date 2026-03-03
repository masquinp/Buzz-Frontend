import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function ConnectionScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Connection")}>
        <Text> Connection </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
      <Text> Inscription </Text>
      </TouchableOpacity>
    </View>
  );
}
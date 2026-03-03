import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ConnectionScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      { /* goBack = pratique de React Navigation qui fonctionne comme un bouton précedent*/}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
      </TouchableOpacity>
      <View>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(value) => setPassword(value)}
          value={password}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Text style={styles.connectionBtn}>Connection</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  connectionBtn: {
    fontSize: 20,
  },
});

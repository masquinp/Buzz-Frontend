import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image
} from "react-native";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/users";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    fetch("http://172.20.10.4:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ email, token: data.token }));
          setEmail("");
          setPassword("");
        }
      });
    // Navigation vers l'écran suivant après succès
    navigation.navigate("Map");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* goBack = pratique de React Navigation qui fonctionne comme un bouton précedent*/}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
      </TouchableOpacity>
    <Image style={styles.logo} source={require('../assets/logo1.png')}></Image>
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
        <TouchableOpacity style={styles.connectionBtn} onPress={() => signIn()}>
          <Text style={styles.textBtn}>Connection</Text>
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
    width: "100%",
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 30,
  },
    textBtn: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  connectionBtn: {
    backgroundColor: "#A7333F",
    margin: "20",
    borderRadius: 50,
    padding: 10,
  },
  logo: {
    width: 250,
    height: 300,
    resizeMode: "contain"
  }
});

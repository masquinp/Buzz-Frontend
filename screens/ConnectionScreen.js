import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
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
          // Navigation vers l'écran suivant après succès
          navigation.navigate("Map");
        } else {
          // alerte ici pour prévenir l'utilisateur
          alert("Email ou mot de passe incorrect");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* goBack = pratique de React Navigation qui fonctionne comme un bouton précedent*/}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            style={styles.arrow}
            icon={faArrowLeft}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../assets/logo7.png")}
        ></Image>
        <View style={styles.inputContainer}>
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
        </View>
        <TouchableOpacity style={styles.connectionBtn} onPress={() => signIn()}>
          <Text style={styles.textBtn}>Connection</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6f0",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginTop: 15,
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
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  arrow: {},
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, addCar, addPhoto } from "../reducers/users";
import Arrow from "../components/Arrow";
import { profileUser } from "../reducers/profile";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();

  // const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // email,
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data complet :", data); 
        if (data.result) {
          const userId = data.user ? data.user._id : data._id;
          dispatch(
            login({
              username: data.user.username,
              token: data.token,
              _id: data.user._id,
            }),
          );
          dispatch(
            profileUser({
              firstname: data.user.firstname,
              lastname: data.user.lastname,
              email: data.user.email,
              username: data.user.username,
            }),
          );
          // Si l'utilisateur a des photos, on les charge une par une dans Redux
          if (data.user.photos && data.user.photos.length > 0) {
            for (const url of data.user.photos) {
              dispatch(addPhoto(url));
            }
          }
          // setEmail("");
          setUsername("");
          setPassword("");
          // si l'utilisateur a enregistré une voiture, on l'affiche avec ça :
          if (data.user.car) {
            dispatch(addCar(data.user.car));
          }
          // Navigation vers l'écran suivant après succès
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          // alerte ici pour prévenir l'utilisateur
          alert("Nom d'utilisateur ou mot de passe incorrect");
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* goBack = pratique de React Navigation qui fonctionne comme un bouton précedent*/}
        <Arrow />
        <Image
          style={styles.logo}
          source={require("../assets/logo7.png")}
        ></Image>
        <View style={styles.inputContainer}>
          {/*<TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          */}
          <TextInput
            placeholder="Username"
            style={styles.input}
            onChangeText={(value) => setUsername(value)}
            value={username}
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
  },
  safeArea: {
    flex: 1,
  },
  input: {
    width: "80%",
    marginTop: 15,
    marginBottom: 30,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 25,
    marginLeft: 35,
  },

  textBtn: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  connectionBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 50,
    padding: 10,
    marginTop: 30,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: -20,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
});

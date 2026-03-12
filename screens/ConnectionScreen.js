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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
              avatar: data.user.avatar,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Arrow />
        <Image
          style={styles.logo}
          source={require("../assets/logo6-removebg-preview.png")}
          accessibilityLabel="Logo de l'application Buzz"
        ></Image>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <TextInput
            placeholder="Entrez votre identifiant"
            placeholderTextColor="#464445"
            accessibilityLabel="Nom d'utilisateur"
            style={styles.input}
            onChangeText={(value) => setUsername(value)}
            value={username}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            placeholder="Entrez votre mot de passe"
            placeholderTextColor="#464445"
            accessibilityLabel="Mot de passe"
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.connectionBtn}
          onPress={() => signIn()}
          accessibilityRole="button"
          accessibilityLabel="Se connecter à mon compte"
        >
          <Text style={styles.textBtn}>Connexion</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  logo: {
    width: 440,
    height: 260,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  inputContainer: {
    width: "85%",
    marginTop: 20,
  },

  label: {
    fontSize: 18,
    color: "#A7333F",
    marginBottom: 6,
    marginLeft: 5,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 25,
  },

  connectionBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 12,          
    paddingVertical: 12,        
    paddingHorizontal: 28,      
    marginTop: 15,
    width: "70%",               
    alignSelf: "center",
  },

  textBtn: {
    fontSize: 20,              
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
});
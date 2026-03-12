import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/users";

import { profileUser } from "../reducers/profile";
import Arrow from "../components/Arrow";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
// emailregex.com
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  const Register = () => {
    if (!EMAIL_REGEX.test(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);

    fetch(`${EXPO_PUBLIC_API_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            // stocke infos utilisateur et token dans store redux
            login({
              username: username,
              token: data.token,
              _id: data.user._id, // _id vient de data.user dans la route signin
            }),
          );

          dispatch(
            profileUser({
              firstname,
              lastname,
              email,
              username,
              password,
            }),
          );

          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fdf6f0" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Arrow />
        <Image
          style={styles.logo}
          source={require("../assets/logo7.png")}
          accessibilityLabel="Logo de l'application Buzz"
        ></Image>
        <View>
          <TextInput
            placeholderTextColor="#ad7b80"
            accessibilityLabel="Prénom"
            placeholder="Prénom"
            style={styles.input}
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
          />
          <TextInput
            placeholderTextColor="#ad7b80"
            accessibilityLabel="Nom de famille"
            placeholder="Nom de famille"
            style={styles.input}
            onChangeText={(value) => setLastname(value)}
            value={lastname}
          />
          <TextInput
            placeholderTextColor="#ad7b80"
            accessibilityLabel="Nom d'utilisateur"
            placeholder="Nom d'utilisateur"
            style={styles.input}
            onChangeText={(value) => setUsername(value)}
            value={username}
          />
          <TextInput
            placeholderTextColor="#ad7b80"
            accessibilityLabel="Adresse email"
            placeholder="Email"
            autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
            keyboardType="email-address" // https://reactnative.dev/docs/textinput#keyboardtype
            textContentType="emailAddress" // https://reactnative.dev/docs/textinput#textcontenttype-ios
            autoComplete="email" // https://reactnative.dev/docs/textinput#autocomplete-android
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
          />

          {/* Affiche un message d'erreur si l'email n'est pas valide */}
          {emailError && (
            <Text style={styles.error}>Adresse email invalide</Text>
          )}
          <TextInput
            placeholderTextColor="#ad7b80"
            accessibilityLabel="Mot de passe"
            placeholder="Mot de passe"
            secureTextEntry={true} // masque le texte pour le mot de passe
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="S'inscrire"
            style={styles.registerBtn}
            onPress={() => Register()}
          >
            <Text style={styles.textBtn}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
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
    width: 250,
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  textBtn: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  registerBtn: {
    backgroundColor: "#A7333F",
    margin: "20",
    borderRadius: 50,
    padding: 10,
    marginTop: 100,
  },
  logo: {
    width: 180,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
  },
});

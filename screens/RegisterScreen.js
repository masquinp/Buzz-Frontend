import {
  Button,
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
// Grabbed from emailregex.com
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
    console.log("email :", email); // 👈
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
        console.log("data signup :", data);
        if (data.result) {
          dispatch(
            login({
              username: username,
              token: data.token,
              _id: data.user._id,
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

          // Navigation vers l'écran suivant après succès
          navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Arrow />
        <Image
          style={styles.logo}
          source={require("../assets/logo7.png")}
        ></Image>
        <View>
          <TextInput
            placeholder="Firstname"
            style={styles.input}
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
          />
          <TextInput
            placeholder="Lastname"
            style={styles.input}
            onChangeText={(value) => setLastname(value)}
            value={lastname}
          />
          <TextInput
            placeholder="Username"
            style={styles.input}
            onChangeText={(value) => setUsername(value)}
            value={username}
          />
          <TextInput
            placeholder="Email"
            autoCapitalize="none" // https://reactnative.dev/docs/textinput#autocapitalize
            keyboardType="email-address" // https://reactnative.dev/docs/textinput#keyboardtype
            textContentType="emailAddress" // https://reactnative.dev/docs/textinput#textcontenttype-ios
            autoComplete="email" // https://reactnative.dev/docs/textinput#autocomplete-android
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
          />

          {emailError && (
            <Text style={styles.error}>Invalid email address</Text>
          )}
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <TouchableOpacity
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
  safeArea: {
    flex: 1,
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

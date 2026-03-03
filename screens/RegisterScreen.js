import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const SignUpRegister = () => {
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              username: username,
              token: data.token,
            }),
          );
          setFirstname("");
          setLastname("");
          setUsername("");
          setEmail("");
          setPassword("");
         
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
      </TouchableOpacity>
      <View>
        <TextInput
          placeholder="Firsname"
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
          <Text style={styles.registerBtn}>Register</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
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
    width: 250,
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  registerBtn: {
    fontSize: 20,
  },
});

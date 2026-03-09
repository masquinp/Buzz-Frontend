import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { profileUser } from "../reducers/profile";
import Arrow from "../components/Arrow";

export default function EditProfile({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.value);

  const [firstname, setFirstname] = useState(profile.firstname || "");
  const [lastname, setLastname] = useState(profile.lastname || "");
  const [email, setEmail] = useState(profile.email || "");
  const [username, setUsername] = useState(profile.username || "");
  const [password, setPassword] = useState(profile.password || "");

  const handleSave = () => {
    dispatch(
      profileUser({
        firstname,
        lastname,
        email,
        username,
        password,
      }),
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView >
      <ScrollView contentContainerStyle={styles.container}>
        <Arrow />
        <Text style={styles.title}>Modifier mon profil</Text>

        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={firstname}
          onChangeText={setFirstname}
          placeholder="Prénom"
        />

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={lastname}
          onChangeText={setLastname}
          placeholder="Nom"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nom d'utilisateur"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A7333F",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#A7333F",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

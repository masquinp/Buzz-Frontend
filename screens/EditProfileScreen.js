import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { profileUser } from "../reducers/profile";
import Arrow from "../components/Arrow";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function EditProfile({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.value);
  const user = useSelector((state) => state.user.value);

  const [firstname, setFirstname] = useState(profile.firstname || "");
  const [lastname, setLastname] = useState(profile.lastname || "");
  const [email, setEmail] = useState(profile.email || "");
  const [username, setUsername] = useState(profile.username || "");
  const [password, setPassword] = useState(profile.password || "");

  const handleSave = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/users/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
        token: user.token,
      }),
    })
      .then((Response) => Response.json())
      .then((data) => {
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
      });
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Modifier mon profil</Text>
        <Arrow />

        {/* --- PHOTO CENTRÉE --- */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: profile.avatar }} style={styles.photo} />
        </View>

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
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  photoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#000",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#A7333F",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    color: "#A7333F",
    marginBottom: 6,
    marginTop: 18,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  saveButton: {
    backgroundColor: "#A7333F",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 40,
    alignItems: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

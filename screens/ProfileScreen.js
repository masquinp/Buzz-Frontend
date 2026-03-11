import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Arrow from "../components/Arrow";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/users";

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.value);
  const user = useSelector((state) => state.user.value);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Home");
  };

  const handleDelete = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/users/delete/${user.token}`, {
      method: "DELETE",
    })
      .then((Response) => Response.json())
      .then((data) => {
        if (data.result) {
          dispatch(logout());
          navigation.navigate("Home");
        }
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileBox}>
        <Arrow />
        <Text style={styles.title}>Mon Compte</Text>
        <Image
          source={{
            uri: profile.avatar,
          }}
          style={styles.photo}
        />
        <Text style={styles.nameText}>
          {profile.firstname} {profile.lastname}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.title}>Mes informations</Text>
        <View style={styles.info}>
          <Text style={styles.value}>Nom : {profile.lastname}</Text>
          <Text style={styles.value}>Prénom : {profile.firstname}</Text>
          <Text style={styles.value}>Email : {profile.email}</Text>
          <Text style={styles.value}>
            Nom d'utilisateur : {profile.username}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <Text style={styles.editTextButton}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Review")}
        >
          <Text style={styles.textButton}>Mes évaluations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyRide")}
        >
          <Text style={styles.textButton}>Trajets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.textButton}>Paiement</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={styles.logoutBtn}>Se deconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteBtn}>Supprimer mon compte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 60,
  },

  profileBox: {
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#A7333F",
  },

  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    backgroundColor: "#000",
  },

  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  info: {
    flexDirection: "column",
  },

  value: {
    color: "#222",
    marginBottom: 10,
    fontSize: 16,
  },

  menuBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  textButton: {
    fontSize: 16,
    color: "#A7333F",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    textAlign: "center",
    color: "white",
    fontSize: 15,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  editButton: {
    backgroundColor: "#A7333F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  editTextButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteBtn: {
    marginTop: 20,
    textAlign: "center",
    color: "#A7333F",
    fontSize: 15,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Arrow from "../components/Arrow";
import { addRide, deleteRide } from "../reducers/rides";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const rides = useSelector((state) => state.rides.value);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState(0);
  // const [placeAvailable, setPlaceAvailable] = useState("");
  const [placesTotal, setPlacesTotal] = useState(0);

  const newRide = () => {
    console.log("Envoi du ride pour l'user ID:", user._id);
    console.log("token envoyé :", user.token); //
    fetch(`${EXPO_PUBLIC_API_URL}/rides/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user.token,
        departure,
        arrival,
        date,

        price: Number(price),
        placesTotal: Number(placesTotal),
        // placeAvailable,
        // placesTotal,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          dispatch(addRide(data.ride));
          alert("Trajet ajouté !");
          // Navigation vers l'écran suivant après succès
          // navigation.navigate("TabNavigator", { screen: "Map" });
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

        <View style={styles.card}>
          <Text style={styles.title}> Nouveau trajet</Text>
          <TextInput
            placeholder="Départ"
            style={styles.input}
            onChangeText={(value) => setDeparture(value)}
            value={departure}
          />
          <TextInput
            placeholder="Arrivée"
            style={styles.input}
            onChangeText={(value) => setArrival(value)}
            value={arrival}
          />
          <TextInput
            placeholder="Date"
            style={styles.input}
            onChangeText={(value) => setDate(value)}
            value={date}
          />
          <TextInput
            placeholder="Prix"
            style={styles.input}
            onChangeText={(value) => setPrice(value)}
            value={price}
          />
          {/*<TextInput
            placeholder="Place available"
            style={styles.input}
            onChangeText={(value) => setPlaceAvailable(value)}
            value={placeAvailable}
          />
          */}
          <TextInput
            placeholder="Nombre de places disponibles"
            style={styles.input}
            onChangeText={(value) => setPlacesTotal(value)}
            value={placesTotal}
          />
          <TouchableOpacity style={styles.addBtn} onPress={() => newRide()}>
            <Text style={styles.textBtn}>Enregistrez</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbdee1",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
  },
  input: {
    width: "100%",
    marginTop: 15,
    borderBottomColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 18,
    paddingBottom: 8,
  },
  textBtn: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A7333F",
    marginBottom: 20,
    textAlign: "center",
  },
  addBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },
});

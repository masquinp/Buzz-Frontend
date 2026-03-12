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
import DateTimePicker from "@react-native-community/datetimepicker";

import Arrow from "../components/Arrow";
import { addRide } from "../reducers/rides";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const rides = useSelector((state) => state.rides.value);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [price, setPrice] = useState(0);
  const [placesTotal, setPlacesTotal] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Fonction pour gérer le changement de date depuis le DateTimePicker
  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowPicker(false); // Ferme le picker sur Android après la sélection
    if (selectedDate) setDate(selectedDate); // Met à jour la date sélectionnée
  };

  const newRide = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/rides/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user.token,
        departure,
        arrival,
        date,

        price: Number(price), // converti en nombre
        placesTotal: Number(placesTotal),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          dispatch(addRide(data.ride));
          alert("Trajet ajouté !");
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#cbdee1" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Arrow />

        <View style={styles.card}>
          <Text style={styles.title}>Nouveau trajet</Text>
          <TextInput
            accessibilityLabel="Lieu de départ"
            placeholder="Départ"
            style={styles.input}
            onChangeText={(value) => setDeparture(value)}
            value={departure}
          />
          <TextInput
            accessibilityLabel="Lieu d'arrivée"
            placeholder="Arrivée"
            style={styles.input}
            onChangeText={(value) => setArrival(value)}
            value={arrival}
          />
          <TouchableOpacity
            accessibilityLabel="Choisir une date de trajet"
            onPress={() => setShowPicker(true)}
            style={styles.input}
          >
            <Text style={{ fontSize: 18, color: date ? "#000" : "#aaa" }}>
              {date ? date.toLocaleDateString("fr-FR") : "Date"}
            </Text>
          </TouchableOpacity>
             { /* affiche le picker  */ } 
          {showPicker && ( 
            <DateTimePicker
              accessibilityLabel="Choisir la date du trajet"
              value={date}
              mode="date" // on choisit uniquement la date, pas l'heure
              display={Platform.OS === "ios" ? "spinner" : "calendar"} // sur iOS, on affiche un spinner, sur Android un calendrier
              onChange={onChange} // fonction appelée à chaque changement de date
              minimumDate={new Date()} // on ne peut pas choisir une date passée
            />
          )}
          <TextInput
            accessibilityLabel="Chosir le prix du trajet"
            placeholder="Prix"
            style={styles.input}
            onChangeText={(value) => setPrice(value)}
            value={price}
          />
          <TextInput
            accessibilityLabel="Chosir le nombre de places disponibles"
            placeholder="Nombre de places disponibles"
            style={styles.input}
            onChangeText={(value) => setPlacesTotal(value)}
            value={placesTotal}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Ajouter ce trajet"
            style={styles.addBtn}
            onPress={() => {
              newRide();
              navigation.goBack();
            }}
          >
            <Text style={styles.textBtn}>Enregistrer</Text>
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

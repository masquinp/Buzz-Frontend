import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Arrow from "../components/Arrow";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addRide, deleteRide } from "../reducers/rides";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const rides = useSelector((state) => state.rides.value);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [placeAvailable, setPlaceAvailable] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [nbSeats, setNbSeats] = useState(0);
  const [licencePlate, setLicencePlate] = useState("");

  const newRide = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/rides/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        departure,
        arrival,
        date,
        price,
        placeAvailable,
        placesTotal,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addRide(data.ride));
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
        <Text style={styles.title}>Ajoutez un trajet</Text>

        <View>
          <TextInput
            placeholder="Departure"
            style={styles.input}
            onChangeText={(value) => setDeparture(value)}
            value={departure}
          />
          <TextInput
            placeholder="Arrival"
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
            placeholder="Price"
            style={styles.input}
            onChangeText={(value) => setPrice(value)}
            value={price}
          />
          <TextInput
            placeholder="Place available"
            style={styles.input}
            onChangeText={(value) => setPlaceAvailable(value)}
            value={placeAvailable}
          />
          <TouchableOpacity style={styles.registerBtn} onPress={() => addRide}>
            <Text style={styles.textBtn}>Valider</Text>
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
  title: {
    fontSize: 25,
  },
});

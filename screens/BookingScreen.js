import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../utils/formatDate";
import { addBooking } from "../reducers/bookings";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState, useRef } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BookingScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const { ride } = route.params;

  const [message, setMessage] = useState("");
  const [seatsBooked, setSeatsBooked] = useState(1);

  const bottomSheetRef = useRef(null);

  const newBooking = () => {
    if (!ride) return; // Sécurité
    fetch(`${EXPO_PUBLIC_API_URL}/bookings/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        ride: ride._id,
        message: message,
        seatsBooked: seatsBooked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addBooking(data.booking));
          // Navigation vers l'écran suivant après succès
          navigation.navigate("Payment", { ride: ride, booking: data.booking });
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "fff" }}>
      <View style={styles.container}>
        <Arrow />
        <FontAwesomeIcon icon={faCircleUser} size={80} color="#545e63" />
        <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 15 }}>
          {ride.user?.firstname} {ride.user?.lastname}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {ride.departure} ➔ {ride.arrival}
        </Text>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {formatDate(ride.date)}
        </Text>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>{ride.price}€</Text>
        <Text style={{ fontSize: 20, marginTop: 5, marginBottom: 20 }}>
          {ride.user?.car
            ? `${ride.user.car.brand} ${ride.user.car.model} ${ride.user.car.color}`
            : "Voiture non renseignée"}
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Réserver ce trajet"
          style={{ width: "50%" }}
          onPress={() => {
            newBooking();
          }}
        >
          <Text style={styles.bookCancelBtn}>Réserver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Annuler la réservation"
          style={{ width: "50%" }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.bookCancelBtn}>Annuler</Text>
        </TouchableOpacity>
      </View>
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
  bookCancelBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 50,
    padding: 10,
    marginTop: 20,
    color: "white",
    fontSize: 22,
    textAlign: "center",
  },
});

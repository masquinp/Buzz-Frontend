import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../utils/formatDate";
import { addBooking } from "../reducers/bookings";

import { useEffect, useState } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BookingScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  // const booking = useSelector((state) => state.booking.value);
  const { ride } = route.params;

  const [message, setMessage] = useState("");
  const [seatsBooked, setSeatsBooked] = useState(1);

  const newBooking = () => {
    if (!ride) return; // Sécurité
    fetch(`${EXPO_PUBLIC_API_URL}/bookings/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        // status : status,
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
          alert("Réservation réussie !");
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <View style={styles.container}>
        <Arrow />
        <Text>
          {ride.user?.firstname} {ride.user?.lastname}
        </Text>
        <Text>
          {ride.departure} ➔ {ride.arrival}
        </Text>
        <Text>{formatDate(ride.date)}</Text>
        <Text>{ride.price}€</Text>
        <Text>
          {ride.user?.car
            ? `${ride.user.car.brand} ${ride.user.car.model} ${ride.user.car.color}`
            : "Voiture non renseignée"}
        </Text>

        <TouchableOpacity
          onPress={() => {
            newBooking();
          }}
        >
          <Text>Réservez</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Annulez</Text>
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
});

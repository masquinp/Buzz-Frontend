import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { deleteBooking } from "../reducers/bookings";
import { useState } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PaymentScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const { ride, booking } = route.params;

  const removeBooking = (bookingId) => {
    if (!user.token) {
      alert("Erreur : Utilisateur non identifié. Reconnectez-vous.");
      return;
    }
    fetch(`${EXPO_PUBLIC_API_URL}/bookings/delete/${bookingId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data.booking :", data.booking);
        if (data.result) {
          dispatch(deleteBooking(bookingId));
          alert("Réservation supprimé");
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <View style={styles.container}>
        <Arrow />
        <Text>{ride.price}€</Text>
        <TouchableOpacity
          onPress={() => {
            removeBooking(booking._id);
          }}
        >
          <Text>Supprimer la réservation</Text>
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

import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { deleteBooking } from "../reducers/bookings";
import { useState } from "react";
import { addPaidBooking } from "../reducers/payment";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faApplePay, faCcVisa } from "@fortawesome/free-brands-svg-icons";
import {
  faCreditCard,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PaymentScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);

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
          navigation.goBack();
          alert("Réservation supprimé");
        } else {
          alert(data.error);
        }
      });
  };

  const newPayment = () => {
    if (!booking) return; // Sécurité

    fetch(`${EXPO_PUBLIC_API_URL}/payments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        amount: ride.price,
        status: "accepted",
        booking: booking._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addPaidBooking(data.payment));
          alert("Paiment validé !");
          // Navigation vers l'écran suivant après succès
          navigation.navigate("ConfirmationPayment", {
            ride: ride,
            booking: booking,
            payment: data.payment,
          });
        } else {
          alert(data.error);
        }
      });
  };

  const pay = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <View style={styles.container}>
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => handleClose()}
                style={{
                  top: 10,
                  left: 20,
                  position: "absolute",
                }}
              >
                <FontAwesomeIcon icon={faXmark} size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleClose();
                  newPayment();
                }}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Confirmez le paiement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />
        <Text>{ride.price}€</Text>
        <TouchableOpacity onPress={() => pay()}>
          <FontAwesomeIcon icon={faApplePay} size={60} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pay()}>
          <FontAwesomeIcon icon={faCcVisa} />
          <Text>Visa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => removeBooking(booking._id)}>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#c2a7a7",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

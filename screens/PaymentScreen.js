import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { deleteBooking } from "../reducers/bookings";
import { useState } from "react";
import { addPaidBooking } from "../reducers/payment";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faApplePay,
  faCcVisa,
  faPaypal,
} from "@fortawesome/free-brands-svg-icons";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Arrow top={80} />
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
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalText}>Confirmez le paiement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.price}>{ride.price}€</Text>
        <Text style={styles.subtitle}>Choisissez votre moyen de paiement</Text>
        <View style={styles.paymentMethod}>
          <TouchableOpacity style={styles.paymentMethod} onPress={() => pay()}>
            <FontAwesomeIcon icon={faApplePay} size={60} />
            <Text style={styles.applePaypalLabel}>Apple Pay</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.paymentMethod} onPress={() => pay()}>
          <View style={styles.visaRow}>
            <FontAwesomeIcon icon={faCcVisa} size={50} />
            <Text style={styles.visaNumber}>•••• 4242</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.paymentMethod}>
          <TouchableOpacity style={styles.paymentMethod} onPress={() => pay()}>
            <FontAwesomeIcon icon={faPaypal} size={40} />
            <Text style={styles.applePaypalLabel}>Paypal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeBooking(booking._id)}>
          <Text style={styles.deleteText}>Supprimer la réservation</Text>
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
    top: 80,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#ecebeb",
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
  price: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 20,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },

  visaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  visaNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
    textAlign: "center",
  },
  deleteText: {
    color: "#999",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 26,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ecebeb",
    padding: 8,
    borderRadius: 14,
    marginBottom: 20,
    width: "80%",
    justifyContent: "center",
  },
  visaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "80%",
    borderRadius: 14,
    padding: 12,
  },
  applePaypalLabel: {
    fontSize: 15,
    color: "#1a1a1a",
    
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "black",

  }
});

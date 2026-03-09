import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { deleteBooking } from "../reducers/bookings";
import { useState } from "react";

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
          alert("Réservation supprimé");
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
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Payez</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />
        <Text>{ride.price}€</Text>
        <TouchableOpacity
          onPress={() => {
            removeBooking(booking._id);
            navigation.goBack();
          }}
        >
          <TouchableOpacity onPress={() => pay()}>
            <Text>Apple Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pay()}>
            <Text>Visa</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            {/* mettre payer dans une modal, quand je clique sur apple pay ou visa une modal apparait et je paie*/}
            <Text>Payer</Text>
          </TouchableOpacity>
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

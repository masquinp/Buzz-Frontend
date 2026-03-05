import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Arrow from "../components/Arrow";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadRides } from "../reducers/rides";
import { addBooking } from "../reducers/bookings";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const allRides = useSelector((state) => state.rides.value);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/rides`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadRides(data.rides));
        }
      })
      .catch((err) => console.log("Erreur :", err));
  }, []);

  // ride = info du trajet
  const showModal = (ride) => {
    setSelectedRide(ride);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const rides = allRides.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        <TouchableOpacity onPress={() => showModal(data)}>
          <View style={styles.boxCard}>
            <View style={styles.infoUser}>
              <FontAwesomeIcon icon={faCircleUser} size={50} color="#000" />
              <Text style={styles.username}> {data.user?.username}</Text>
            </View>
            <Text style={styles.destination}>
              {data.departure} ➔ {data.arrival}
            </Text>
            <Text style={styles.price}>{data.price}€</Text>
            <Text style={styles.date}>{data.date}</Text>
            {/* <Text>Places restantes : {data.placeAvailable}</Text> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  });


 /*  const newBooking = () => {
    if (!selectedRide) return; // Sécurité
      fetch(`${EXPO_PUBLIC_API_URL}/bookings/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: user.token,
          seatsBooked : seatsBooked,
          ride: selectedRide._id,
          message: message,
          
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(addBooking(data.booking));
            // Navigation vers l'écran suivant après succès
            navigation.navigate("Bookings")}
            alert("Réservation réussie !");
          } else {
            alert(data.error);
          }
        });
    };
*/
    const newBooking = () => {
    if (!selectedRide) return; // Sécurité

    fetch(`${EXPO_PUBLIC_API_URL}/bookings/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        seatsBooked: seatsBooked,
        ride: selectedRide._id,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addBooking(data.booking));
          alert("Réservation réussie !");
          navigation.navigate("Bookings");
        } else {
          alert(data.error);
        }
      }); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {selectedRide && (
                <>
                  <View style={styles.modalContainer}>
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      size={85}
                      color="#000"
                    />
                    <Text style={styles.modalUsername}>
                      {selectedRide.user?.username}
                    </Text>
                    <Text style={styles.modalDestination}>
                      {selectedRide.departure} ➔ {selectedRide.arrival}
                    </Text>

                    <Text style={styles.modalDate}>
                      Date : {selectedRide.date}
                    </Text>
                    <Text style={styles.modalPrice}>
                      Prix : {selectedRide.price}€
                    </Text>
                    <Text style={styles.other}>Autres passagers : </Text>
                  </View>
                </>
              )}
              <TouchableOpacity style={styles.button} onPress={() => newBooking()}>
                <Text>Validez le trajet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={styles.button}
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faXmark} size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />
        <View style={styles.container}>
          <Text style={styles.title}>Trajets disponibles</Text>
          {rides}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    gap: 15,
  },
  username: {
    fontSize: 24,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "bold",
    color: "#A7333F",
  },
  infoUser: {
    flexDirection: "row",
  },
  boxCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  price: {
    textAlign: "right",
    fontSize: 25,
  },
  destination: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#d7bebe",
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
    width: "85%",
    height: "70%",
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#A7333F",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  modalDestination: {
    fontSize: 25,
  },
  modalContainer: {
    alignItems: "center",
  },
  modalUsername: {
    fontSize: 35,
    fontWeight: "bold",
  },
  modalDate: {
    fontSize: 25,
  },
  modalPrice: {
    fontSize: 25,
  },
  other: {
    fontSize: 25,
  },
});

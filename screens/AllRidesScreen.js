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

import { formatDate } from "../utils/formatDate";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AllRidesScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const allRides = useSelector((state) => state.rides.value);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [message, setMessage] = useState("");

  // On récupère les filtres envoyés depuis MapScreen, ou des strings vides si aucun filtre
  const filterDeparture = route.params?.departure || "";
  const filterArrival = route.params?.arrival || "";
  // const filterDate = route.params?.date || "";

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

  // on filtre tous les rides pour récupérer ceux qui nous interesse
  const rides = allRides
    .filter((data) => {
      const matchDeparture = data.departure
        .toLowerCase()
        .includes(filterDeparture.toLowerCase());
      const matchArrival = data.arrival
        .toLowerCase()
        .includes(filterArrival.toLowerCase());
      return matchDeparture && matchArrival;
    })
    .map((data, i) => {
      return (
        <View key={i} style={styles.card}>
          <TouchableOpacity onPress={() => showModal(data)}>
            <View style={styles.boxCard}>
              <View style={styles.row}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    size={50}
                    color="#545e63"
                  />
                  <Text style={{ fontSize: 18, paddingLeft: 10 }}>
                    {data.user?.firstname} {data.user?.lastname}
                  </Text>
                </View>
                <View style={styles.carAndStars}>
                  <Text style={{ paddingTop: 15, alignSelf: 'flex-end' }}>
                    {data.user?.car
                      ? `${data.user.car.brand} ${data.user.car.model}`
                      : ""}
                  </Text>
                  <Text style={{ paddingTop: 10 }}>⭐⭐⭐⭐⭐</Text>
                </View>
              </View>

              <Text style={{ fontSize: 15 }}>
                {data.departure} ➔ {data.arrival}
              </Text>

              <View style={styles.row}>
                <Text style={styles.date}>{formatDate(data.date)}</Text>
                <Text style={{ fontSize: 22, paddingRight: 20 }}>
                  {data.price}€
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    });

  const displayCar = () => {
    if (!selectedRide) return "Non renseignée";
    if (selectedRide.user?.car) {
      return `${selectedRide.user.car.brand} ${selectedRide.user.car.model} ${selectedRide.user.car.color} ${selectedRide.user.car.licencePlate}`;
    }
    return "Non renseignée";
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={{ top: 10, left: 10, position: "absolute" }}
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faXmark} size={40} color="black" />
              </TouchableOpacity>
              {selectedRide && (
                <>
                  <View style={styles.modalContainer}>
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      size={85}
                      color="#463838"
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {selectedRide.user?.firstname}{" "}
                      {selectedRide.user?.lastname}
                    </Text>

                    <Text style={{ paddingTop: 10 }}>⭐⭐⭐⭐⭐</Text>
                    <View style={styles.separator} />
                    <Text style={{ fontSize: 20 }}>
                      {selectedRide.departure} ➔ {selectedRide.arrival}
                    </Text>

                    <Text style={{ fontSize: 20 }}>
                      {formatDate(selectedRide.date)}
                    </Text>
                    <Text style={{ fontSize: 25 }}>{selectedRide.price}€</Text>

                    <Text style={styles.modalCar}>{displayCar()}</Text>
                    <View style={styles.separator} />
                    <Text style={{ fontSize: 25 }}>Autres passagers : </Text>
                  </View>
                </>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => newBooking()}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  Validez le trajet
                </Text>
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
  container: {
    flex: 1,
    paddingTop: 50,
    gap: 15,
    backgroundColor: "#cbdee1",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
    color: "#A7333F",
  },

  boxCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingTop: -10,
  },
  modalView: {
    backgroundColor: "#dfc9c9",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
    width: "85%",
    height: "65%",
  },
  button: {
    width: "65%",
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "#A7333F",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  modalContainer: {
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
    paddingTop: 40,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  separator: {
    marginVertical: 10,
  },
});

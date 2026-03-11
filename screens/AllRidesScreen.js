import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Arrow from "../components/Arrow";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadRides } from "../reducers/rides";

import { formatDate } from "../utils/formatDate";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AllRidesScreen({ navigation, route }) {
  const dispatch = useDispatch();

  const allRides = useSelector((state) => state.rides.value);

  const [selectedRide, setSelectedRide] = useState(null);

  // On récupère les filtres envoyés depuis MapScreen, ou des strings vides si aucun filtre
  const filterDeparture = route.params?.departure || "";
  const filterArrival = route.params?.arrival || "";

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

  // on filtre tous les rides pour récupérer ceux qui nous interesse
  const rides = allRides
    .filter((data) => {
      const matchDeparture = data.departure
        .toLowerCase()
        .includes(filterDeparture.toLowerCase()); // trie par lieu de départ
      const matchArrival = data.arrival
        .toLowerCase()
        .includes(filterArrival.toLowerCase()); // trie par lieu d'arrivée
      const matchDate = new Date(data.date) >= new Date(); // affiche les trajets à venir uniquement
      return matchDeparture && matchArrival && matchDate;
    })
    .sort((a, b) => a.price - b.price) // trie les trajets affichés par prix croissant
    .map((data, i) => {
      return (
        <View key={i} style={styles.card}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sélectionner ce trajet"
            onPress={() => {
              setSelectedRide(data);
              navigation.navigate("Booking", { ride: data });
            }}
          >
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
                  <Text style={{ paddingTop: 15, alignSelf: "flex-end" }}>
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Arrow />
        <View style={styles.container}>
          <Text style={styles.title}>Trajets disponibles</Text>
          {rides.length === 0 ? (
            <Text>Aucun trajet existant avec ces lieux</Text>
          ) : (
            rides
          )}
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
    backgroundColor: "fff",
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

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Arrow from "../components/Arrow";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadRides } from "../reducers/rides";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const allRides = useSelector((state) => state.rides.value);

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

  /*const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [placeAvailable, setPlaceAvailable] = useState("");
  const [placesLeft, setPlacesLeft] = useState("");
  const [totalCost, setTotalCost] = useState("");
  


     const newRide = () => {
    fetch(`${EXPO_PUBLIC_API_URL}/rides/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        departure,
        arrival,
        date,
        price,
        placeAvailable,
        placesTotal,
         user,
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
  */

  const rides = allRides.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        <View>
          <Text style={styles.username}>👤 {data.user?.username}</Text>
          <Text style={styles.departure}>
            {data.departure} ➔ {data.arrival}
          </Text>
          <Text style={styles.price}>{data.price}€</Text>
          <Text style={styles.date}>{data.date}</Text>
          <Text>Places restantes : {data.placeAvailable}</Text>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
    flex: 1
  }
});

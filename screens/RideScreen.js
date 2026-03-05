import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ride from "../components/ride";
import Arrow from "../components/Arrow";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideScreen() {
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [bookings, setBookings] = useState([]);
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_API_URL}/bookings/${user.token}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        setBookings(data.bookings);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Arrow />
          <Text style={styles.trajetText}>Historique des Trajets</Text>
        </View>
       <ScrollView style={styles.listeBox}>
        {bookings.map((data, i) => (
          <Ride
            key={i}
            photo={data.ride?.user?.photo}
            name={data.ride?.user?.prenom}
            car={data.ride?.car}
            note={data.ride?.note}
            date={data.ride?.date}
            price={data.ride?.price}
          />
        ))}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trajetText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A7333F",
    textAlign: "center",
  },
  listeBox: {
    paddingHorizontal: 15,
  },
});

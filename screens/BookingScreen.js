import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../utils/formatDate";
import { addBooking } from "../reducers/bookings";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BookingScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const { ride } = route.params;

  const [seatsBooked] = useState(1);

  const newBooking = () => {
    if (!ride) return;
    fetch(`${EXPO_PUBLIC_API_URL}/bookings/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        ride: ride._id,
        seatsBooked: seatsBooked,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addBooking(data.booking));
          navigation.navigate("Payment", { ride: ride, booking: data.booking });
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Arrow />

        <View style={styles.driverSection}>
          <FontAwesomeIcon icon={faCircleUser} size={90} color="#545e63" />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>
              {ride.user?.firstname} {ride.user?.lastname}
            </Text>
            <View style={styles.starsRow}>
              <FontAwesomeIcon icon={faStar} size={16} color="#F5A623" />
              <FontAwesomeIcon icon={faStar} size={16} color="#F5A623" />
              <FontAwesomeIcon icon={faStar} size={16} color="#F5A623" />
              <FontAwesomeIcon icon={faStar} size={16} color="#F5A623" />
              <FontAwesomeIcon icon={faStarEmpty} size={16} color="#F5A623" />
            </View>
          </View>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Départ</Text>
            <Text style={styles.tripValue}>{ride.departure}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Arrivée</Text>
            <Text style={styles.tripValue}>{ride.arrival}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Date</Text>
            <Text style={styles.tripValue}>{formatDate(ride.date)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Voiture</Text>
            <Text style={styles.tripValue}>
              {ride.user?.car
                ? `${ride.user.car.brand} ${ride.user.car.model}`
                : "Non renseignée"}
            </Text>
          </View>
        </View>

        {/* Section pour les autres passagers */}
        <Text style={styles.sectionTitle}>Autres passagers</Text>
        <View style={styles.passengersCard}>
          <View style={styles.passengerItem}>
            <FontAwesomeIcon icon={faCircleUser} size={50} color="#545e63" />
            <Text style={styles.passengerName}>Marc</Text>
          </View>
          <View style={styles.passengerItem}>
            <FontAwesomeIcon icon={faCircleUser} size={50} color="#545e63" />
            <Text style={styles.passengerName}>Léa</Text>
          </View>
        </View>

        <Text style={styles.price}>{ride.price}€</Text>

        <TouchableOpacity
          style={styles.bookButton}
          accessibilityRole="button"
          accessibilityLabel="Réserver ce trajet"
          onPress={newBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Valider le trajet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Annuler"
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  driverSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  driverInfo: {
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  driverName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  tripCard: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  tripLabel: {
    fontSize: 15,
    color: "#888",
  },
  tripValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  passengersCard: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 80,
    marginBottom: 24,
    justifyContent: "space-between",
    paddingLeft: 65,
    paddingRight: 65,
  },
  passengerItem: {
    alignItems: "center",
    gap: 6,
  },
  passengerName: {
    fontSize: 13,
    color: "#555",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 24,
  },
  bookButton: {
    width: "100%",
    backgroundColor: "#A7333F",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  cancelText: {
    color: "#999",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});


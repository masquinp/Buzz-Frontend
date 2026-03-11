import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";

// fausse position du chauffeur
const FAKE_DRIVER_START = {
  latitude: 48.8566,
  longitude: 2.3522,
};
const FAKE_PASSENGER_START = {
  latitude: 48.8566,
  longitude: 2.3522,
};

export default function ConfirmationPaymentScreen({ navigation, route }) {
  const [driverPosition, setDriverPosition] = useState(FAKE_DRIVER_START);

  const { ride, booking, payment } = route.params;

  //déclenchement de la position du chauffeur toutes les 2 secondes pour simuler un déplacement
  useEffect(() => {
    const interval = setInterval(() => {
      // On met à jour la position du chauffeur
      setDriverPosition((prev) => ({
        latitude: prev.latitude + 0.0001, // déplace vers le nord
        longitude: prev.longitude + 0.0001, // déplace vers l'est
      }));
    }, 2000);

    // Quand on quitte l'écran, on arrête le setInterval pour éviter les fuites mémoire
    return () => clearInterval(interval);
  }, []); // [] = se lance une seule fois au chargement de l'écran

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "fff" }}>
      <View style={styles.container}>
        <Arrow />
        <View style={styles.header}>
          <Text style={styles.title}>Paiement confirmé !</Text>
          <Text style={styles.subtitle}>Votre chauffeur est en route</Text>
        </View>

        <MapView
          style={styles.map}
          region={{
            latitude: driverPosition.latitude,
            longitude: driverPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            style={styles.driverMarker}
            accessibilityLabel="La position de votre chauffeur"
            coordinate={driverPosition}
            title="Votre chauffeur"
          >
            <Text style={{ fontSize: 30 }}>🚗</Text>
          </Marker>
        </MapView>

        <Text style={styles.contactDriver}>Contacter votre chauffeur</Text>

        <TouchableOpacity
          style={styles.chatButton}
          accessibilityRole="button"
          accessibilityLabel="Contacter votre chauffeur"
          onPress={() => {
            navigation.navigate("Chat", { bookingId: booking._id });
          }}
        >
          <Text>
            <FontAwesome name="comments" size={25} color="white" />;
          </Text>
          <Text style={styles.contactDriver}>Contacter votre chauffeur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.arrivedBtn}
          accessibilityRole="button"
          accessibilityLabel="Confirmer que vous êtes arrivé à destination"
          onPress={() =>
            navigation.navigate("AddReview", {
              ride: ride,
              booking: booking,
              payment: payment,
            })
          }
        >
          <Text style={styles.arrivedText}>Bien arrivé à destination</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Retour à l'accueil"
          onPress={() => navigation.navigate("TabNavigator", { screen: "Map" })}
        >
          <Text style={styles.homeText}>Retour à l'accueil</Text>
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
  map: {
    width: "90%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A7333F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#616060",
  },
  contactDriver: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#A7333F",
    borderRadius: 14,
    padding: 16,
    width: "75%",
    justifyContent: "center",
    marginBottom: 12,
  },
  homeText: {
    color: "#999",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  arrivedBtn: {
    width: "70%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A7333F",
    marginBottom: 25,
  },
  arrivedText: {
    color: "#A7333F",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
    marginTop: -10,
  },
});

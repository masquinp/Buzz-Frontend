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
          <Marker coordinate={driverPosition} title="Votre chauffeur">
            <Text style={{ fontSize: 30 }}>🚗</Text>
          </Marker>
        </MapView>

        <Text>Contactez votre chauffeur</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Chat", { bookingId: booking._id });
          }}
        >
          <Text>
            <FontAwesome name="comments" size={20} color="black" />;
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TabNavigator", { screen: "Map" })}
        >
          <Text>Retour à l'accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddReview", {
              ride: ride,
              booking: booking,
              payment: payment,
            })
          }
        >
          <Text>Bien arrivé à destination</Text>
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
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
});

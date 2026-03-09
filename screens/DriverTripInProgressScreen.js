import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function DriverTripInProgressScreen({ navigation, route }) {
  const tripId = route?.params?.tripId || "trip_123";
  const pickupAddress =
    route?.params?.pickupAddress || "12 rue Oberkampf, Paris";
  const dropoffAddress =
    route?.params?.dropoffAddress || "25 avenue de Clichy, Paris";

  // destination mock Paris
  const destination = {
    latitude: 48.8719,
    longitude: 2.347,
  };

  const [driverLocation, setDriverLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

 useEffect(() => {

  async function startTracking() {
    try {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        setErrorMessage("Permission de localisation refusée");
        return;
      }

      setHasPermission(true);

      const currentPosition = await Location.getCurrentPositionAsync({});

      const coords = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      setDriverLocation(coords);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {

          const newCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setDriverLocation(newCoords);

          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                ...newCoords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              800
            );
          }
        }
      );

    } catch (error) {
      setErrorMessage("Impossible de récupérer la position du conducteur");
    }
  }

  startTracking();

  return () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
  };

}, []);

  const handleFinishTrip = () => {
    Alert.alert("Trajet terminé", "Fin du trajet conducteur");

    navigation.navigate("DriverTripCompleted", {
      tripId,
      pickupAddress,
      dropoffAddress,
    });
  };

  const initialRegion = driverLocation
    ? {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 48.864716,
        longitude: 2.349014,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header flottant */}
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Trajet en cours</Text>
          <Text style={styles.headerSubtitle}>Trip ID : {tripId}</Text>
        </View>

        {/* MAP */}
        <MapView
          ref={mapRef}
          style={styles.map}
          region={initialRegion}
          showsUserLocation={false}
          showsCompass={false}
        >
          {driverLocation && (
            <Marker coordinate={driverLocation} title="Conducteur">
              <View style={styles.driverMarker}>
                <Text style={styles.markerText}>🚗</Text>
              </View>
            </Marker>
          )}

          <Marker coordinate={destination} title="Destination">
            <View style={styles.destinationMarker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
          </Marker>
        </MapView>

        {/* Infos trajet */}
        <View style={styles.infoPanel}>
          <Text style={styles.sectionTitle}>Départ</Text>
          <Text style={styles.value}>{pickupAddress}</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Arrivée</Text>
          <Text style={styles.value}>{dropoffAddress}</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Localisation</Text>
          <Text style={styles.value}>
            {hasPermission === false
              ? "Permission refusée"
              : driverLocation
              ? "Position conducteur mise à jour"
              : "Recherche de position..."}
          </Text>

          {!!errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleFinishTrip}>
            <Text style={styles.buttonText}>Terminer le trajet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  map: {
    flex: 1,
  },

  headerCard: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
  },

  infoPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  separator: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 12,
  },

  errorText: {
    marginTop: 10,
    color: "#B42318",
    fontSize: 13,
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  driverMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DBEAFE",
    borderWidth: 2,
    borderColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  destinationMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FDE2E2",
    borderWidth: 2,
    borderColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  markerText: {
    fontSize: 18,
  },
});
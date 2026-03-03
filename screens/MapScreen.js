import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null); // useState obligé pour récupérer la position

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync(
          { distanceInterval: 10 }, // récupérer la position en temps réel en précisant l'intervalle d’actualisation avec Location.watchPositionAsync.
          (location) => {
            setLocation(location.coords); // le setLocation ici avec les coordonnées
          },
        );
      }
    })();
  }, []);

  // 1. SI la location est nulle, on affiche un écran d'attente, attention, ne fonctionne pas sans ces lignes
  if (!location) {
    return <View style={{ flex: 1 }}></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.message}>Where are you going ?</Text>
        <TouchableOpacity>
          <FontAwesomeIcon icon={faUser} size={28} color="#A7333F" />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          testID="marker"
          style={styles.marker}
          title="My location"
          pinColor="#A7333F"
          coordinate={location}
        />
      </MapView>
      <View>
        <TouchableOpacity>
          <Text style={styles.rideBtn}> Find a ride </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  message: {
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rideBtn: {
    fontSize: 30,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Arrow from "../components/Arrow";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null); // useState obligé pour récupérer la position
  const [modalVisible, setModalVisible] = useState(false);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  // const [date, setDate] = useState("");

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

  const addRide = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.itinéraire}>Votre intinéraire</Text>
                <TextInput
                  placeholder="Departure"
                  onChangeText={(value) => setDeparture(value)}
                  value={departure}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Arrival"
                  onChangeText={(value) => setArrival(value)}
                  value={arrival}
                  style={styles.input}
                />
              </View>
              <TouchableOpacity
                onPress={() => addRide()}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Ajoutez</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleClose()}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermez</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />
        <View style={styles.header}>
          <TouchableOpacity style={styles.rideBtn} onPress={() => addRide()}>
            <Text style={styles.message}>Où allez-vous?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <FontAwesomeIcon icon={faUser} size={40} color="#A7333F" />
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
          <TouchableOpacity
            style={styles.textBtn}
            onPress={() => navigation.navigate("Driver")}
          >
            <Text style={styles.driverBtn}> Conducteur ? Cliquez-ici </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6f0",
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#c2a7a7",
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
  },
  input: {
    width: 180,
    borderBottomColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
    color: "white",
    marginBottom: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  driverBtn: {
    backgroundColor: "#A7333F",
    margin: "20",
    borderRadius: 5,
    padding: 8,
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  rideBtn: {
    backgroundColor: "#c2a7a7",
    borderRadius: 25,
    justifyContent: "center",
    marginLeft: 60,
    alignItems: "center",
  },
  message: {
    fontSize: 25,
    marginLeft: "100",
    color: "#67262d",
    alignItems: "center",
  },
});

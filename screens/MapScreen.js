import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
            <TouchableOpacity onPress={() => addRide()} style={styles.button} activeOpacity={0.8}>
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
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.message}>Où allez-vous?</Text>
        <TouchableOpacity>
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
        <TouchableOpacity style={styles.rideBtn} onPress={() => addRide()}>
          <Text style={styles.textBtn}> Trouvez un trajet </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6f0'
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
    backgroundColor: "#c1a4a4",
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
    width: 150,
    borderBottomColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 16,
    color: 'black'
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

  message: {
    fontSize: 25,
    marginLeft: '100'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rideBtn: {
    backgroundColor: "#A7333F",
    margin: "20",
    borderRadius: 5,
    padding: 8,
  },
  textBtn: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
});

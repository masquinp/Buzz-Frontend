
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Arrow from "../components/Arrow";

export default function MapScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (loc) =>
          setLocation(loc.coords),
        );
      }
    })();
  }, []);

  if (!location)
    return <View style={{ flex: 1, backgroundColor: "#fdf6f0" }} />;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Carte */}
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
          title="Vous êtes ici"
          pinColor="#A7333F"
          coordinate={location}
        />
      </MapView>

      {/* Bonjour + Arrow */}
      <View style={styles.topContainer}>
        <Text style={styles.welcome}>Bonjour {user.username}</Text>
        <Arrow />
      </View>

      {/* Header avec "Où allez-vous ?" et icône profil */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.rideBtn} onPress={openModal}>
          <Text style={styles.message}>Où allez-vous ?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <View style={styles.profileIconContainer}>
            <FontAwesomeIcon icon={faUser} size={30} color="#A7333F" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal itinéraire */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.itinerary}>Votre itinéraire</Text>
            <TextInput
              placeholder="Départ"
              onChangeText={setDeparture}
              value={departure}
              style={styles.input}
            />
            <TextInput
              placeholder="Arrivée"
              onChangeText={setArrival}
              value={arrival}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.input}
            >
              <Text style={{ fontSize: 18, color: date ? "#715858" : "#aaa" }}>
                {date ? date.toLocaleDateString("fr-FR") : "Date"}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                closeModal();
                navigation.navigate("AllRides", { departure, arrival, date });
              }}
              style={styles.button}
            >
              <Text style={styles.textButton}>Continuez</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
              <Text style={styles.textButton}>Fermez</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bouton principal et phrase cliquable */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.ridesButton}
          onPress={() => navigation.navigate("AllRides")}
        >
          <Text style={styles.ridesText}>
            Voir tous les trajets disponibles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Driver")}>
          <Text style={styles.driverText}>Conducteur ? Cliquez-ici</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  topContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  welcome: { fontSize: 22, fontWeight: "600", color: "#333", marginBottom: 30 },

  header: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rideBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
  },
  message: { fontSize: 18, color: "#715858" },

  profileIconContainer: {
    backgroundColor: "#fff",
    height:50,
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },

  ridesButton: {
    width: "100%",
    backgroundColor: "#A7333F",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  ridesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" },

  driverText: {
    color: "#A7333F",
    fontSize: 18,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itinerary: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#A7333F",
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#A7333F",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  textButton: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" },
});

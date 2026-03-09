import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function DriverTripCompletedScreen({ navigation, route }) {
  const tripId = route?.params?.tripId || "trip_123";

  const handleBackHome = () => {
    navigation.navigate("DriverHome");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ICON */}
        <View style={styles.iconBox}>
          <Text style={styles.icon}>✅</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Trajet terminé</Text>

        {/* MESSAGE */}
        <Text style={styles.subtitle}>
          Merci pour ce trajet. Les paiements ont été traités avec succès.
        </Text>

        {/* DEBUG */}
        <View style={styles.debug}>
          <Text style={styles.debugText}>tripId : {tripId}</Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleBackHome}>
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
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
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBox: {
    marginBottom: 20,
  },

  icon: {
    fontSize: 60,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },

  debug: {
    marginBottom: 40,
  },

  debugText: {
    fontSize: 12,
    color: "#999",
  },

  button: {
    backgroundColor: "#111",
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
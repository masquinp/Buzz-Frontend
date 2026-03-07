import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function BookingConfirmScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);

  const handleReserve = async () => {

  // Vérifie si carte enregistrée
  if (!user.defaultPaymentMethodId) {
    Alert.alert(
      "Moyen de paiement requis",
      "Veuillez enregistrer une carte avant de réserver.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Ajouter une carte",
          onPress: () => navigation.navigate("AddPaymentMethod"),
        },
      ]
    );
    return;
  }

  try {

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/bookings/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: user.token,
        ride: route.params.rideId,
        seatsBooked: 1,
        message: "",
      }),
    });

    const data = await response.json();

    if (!data.result) {
      Alert.alert("Erreur", data.error);
      return;
    }

    Alert.alert("Succès", "Réservation confirmée 🎉");

    navigation.navigate("Bookings");

  } catch (error) {
    console.log(error);
    Alert.alert("Erreur", "Impossible de réserver");
  }
};

  const handleUseAnotherCard = () => {
    navigation.navigate("AddPaymentMethod");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paiement</Text>

      {!user.defaultPaymentMethodId ? (
        <View style={styles.cardBox}>
          <Text style={styles.label}>Aucune carte enregistrée</Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => navigation.navigate("AddPaymentMethod")}
          >
            <Text style={styles.mainButtonText}>Ajouter une carte</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardBox}>
          <Text style={styles.label}>Carte par défaut</Text>
          <Text style={styles.cardText}>
            Carte enregistrée ✅
          </Text>
          <Text style={styles.subText}>
            PaymentMethod : {user.defaultPaymentMethodId}
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleUseAnotherCard}
          >
            <Text style={styles.secondaryButtonText}>Utiliser une autre carte</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.mainButton} onPress={handleReserve}>
        <Text style={styles.mainButtonText}>Valider le trajet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111",
  },
  cardBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  cardText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 6,
  },
  subText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 14,
  },
  mainButton: {
    backgroundColor: "#ad2831",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  mainButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ad2831",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#ad2831",
    fontWeight: "700",
    fontSize: 15,
  },
});
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


import QRCode from "react-native-qrcode-svg";

export default function BookingConfirmedScreen({ navigation, route }) {
  const bookingId = route?.params?.bookingId || "booking_1";
  const tripId = route?.params?.tripId || "trip_123";
  const passengerName = route?.params?.passengerName || "Alice";
  const amount = route?.params?.amount || 8.5;

  const formatAmount = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Réservation confirmée</Text>

          <Text style={styles.subtitle}>
            Bonjour {passengerName}, présente ce QR code au conducteur avant le départ.
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Statut</Text>
            <Text style={styles.sectionValue}>Paiement autorisé</Text>

            <View style={styles.separator} />

            <Text style={styles.sectionLabel}>Trajet</Text>
            <Text style={styles.sectionValue}>{tripId}</Text>

            <View style={styles.separator} />

            <Text style={styles.sectionLabel}>Montant autorisé</Text>
            <Text style={styles.sectionValue}>{formatAmount(amount)}</Text>
          </View>

          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>QR passager</Text>
            <Text style={styles.qrSubtitle}>
              Le QR contient uniquement ton code de réservation.
            </Text>

            <View style={styles.qrWrapper}>
              <QRCode value={bookingId} size={220} />
            </View>

            <Text style={styles.bookingText}>Booking ID : {bookingId}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              Aucun débit immédiat. Le conducteur validera ta présence avec ce QR code.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Retour</Text>
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
    justifyContent: "space-between",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },

  sectionValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  separator: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 14,
  },

  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },

  qrTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },

  qrSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },

  qrWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
  },

  bookingText: {
    marginTop: 18,
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginTop: 20,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
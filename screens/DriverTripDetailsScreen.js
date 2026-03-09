import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function DriverTripDetailsScreen({ navigation, route }) {
  const tripId = route?.params?.tripId || "trip_123";
  const pickupAddress =
    route?.params?.pickupAddress || "12 rue Oberkampf, Paris";
  const dropoffAddress =
    route?.params?.dropoffAddress || "25 avenue de Clichy, Paris";

  const [passengers, setPassengers] = useState([
    {
      passengerId: "p1",
      name: "Alice",
      bookingId: "booking_1",
      paymentIntentId: "pi_1",
      amount: 8.5,
      status: "pending",
    },
    {
      passengerId: "p2",
      name: "Mehdi",
      bookingId: "booking_2",
      paymentIntentId: "pi_2",
      amount: 7.2,
      status: "validated",
    },
    {
      passengerId: "p3",
      name: "Chloé",
      bookingId: "booking_3",
      paymentIntentId: "pi_3",
      amount: 6.8,
      status: "pending",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lastScannedBookingId, setLastScannedBookingId] = useState("");

  const pendingCount = passengers.filter((p) => p.status === "pending").length;
  const validatedCount = passengers.filter((p) => p.status === "validated").length;
  const absentCount = passengers.filter((p) => p.status === "absent").length;

  const canStartTrip = useMemo(() => {
    return (
      passengers.length > 0 &&
      passengers.every(
        (p) => p.status === "validated" || p.status === "absent"
      )
    );
  }, [passengers]);

  const formatAmount = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "En attente";
    if (status === "validated") return "Validé";
    if (status === "absent") return "Absent";
    return status;
  };

  const getStatusStyle = (status) => {
    if (status === "pending") return styles.badgePending;
    if (status === "validated") return styles.badgeValidated;
    if (status === "absent") return styles.badgeAbsent;
    return styles.badgePending;
  };

  const getStatusTextStyle = (status) => {
    if (status === "pending") return styles.badgeTextPending;
    if (status === "validated") return styles.badgeTextValidated;
    if (status === "absent") return styles.badgeTextAbsent;
    return styles.badgeTextPending;
  };

  // -----------------------------
  // LOGIQUE QR MINIMALE
  // -----------------------------
  const handleValidatePassengerByBookingId = (scannedBookingId) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!scannedBookingId) return;

    const foundPassenger = passengers.find(
      (passenger) => passenger.bookingId === scannedBookingId
    );

    if (!foundPassenger) {
      setErrorMessage("QR invalide pour cette course");
      return;
    }

    if (foundPassenger.status === "validated") {
      setErrorMessage("Passager déjà validé");
      return;
    }

    if (foundPassenger.status === "absent") {
      setErrorMessage("Ce passager a déjà été marqué absent");
      return;
    }

    setPassengers((currentPassengers) =>
      currentPassengers.map((passenger) => {
        if (passenger.bookingId === scannedBookingId) {
          return { ...passenger, status: "validated" };
        }
        return passenger;
      })
    );

    setLastScannedBookingId(scannedBookingId);
    setSuccessMessage(`${foundPassenger.name} a été validé avec succès`);

    Alert.alert(
      "QR validé",
      `${foundPassenger.name} a bien été validé.`
    );
  };

  // Quand on revient du screen scanner avec un bookingId scanné
  useEffect(() => {
    const scannedBookingId = route?.params?.scannedBookingId;

    if (scannedBookingId) {
      handleValidatePassengerByBookingId(scannedBookingId);

      // on nettoie le param pour éviter que ça se rejoue
      navigation.setParams({
        scannedBookingId: undefined,
      });
    }
  }, [route?.params?.scannedBookingId]);

  const handleOpenScanner = () => {
    setErrorMessage("");
    setSuccessMessage("");

    navigation.navigate("DriverQrScanner", {
      tripId,
    });
  };

  // Fallback si tu veux tester sans caméra
  const handleFakeScanPassenger = (bookingId) => {
    handleValidatePassengerByBookingId(bookingId);
  };

  const handleMarkAbsent = (passengerId) => {
    setErrorMessage("");
    setSuccessMessage("");

    setPassengers((currentPassengers) =>
      currentPassengers.map((passenger) => {
        if (passenger.passengerId === passengerId) {
          return { ...passenger, status: "absent" };
        }
        return passenger;
      })
    );
  };

 const handleStartTrip = async () => {
  try {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const validatedPassengers = passengers.filter(
      (p) => p.status === "validated"
    );
    const absentPassengers = passengers.filter((p) => p.status === "absent");

    for (const passenger of validatedPassengers) {
      const response = await fetch("http://10.0.2.2:3000/capture-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: passenger.bookingId,
          finalAmount: Math.round(passenger.amount * 100),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Erreur capture pour ${passenger.name}`
        );
      }
    }

    for (const passenger of absentPassengers) {
      const response = await fetch("http://10.0.2.2:3000/cancel-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: passenger.bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Erreur annulation pour ${passenger.name}`
        );
      }
    }

    setSuccessMessage("Tous les passagers ont été traités. Le trajet démarre.");

    Alert.alert(
      "Trajet démarré",
      "Les paiements des passagers présents ont été capturés et les absents ont été annulés."
    );

    navigation.navigate("DriverTripInProgress", {
      tripId,
      pickupAddress,
      dropoffAddress,
    });
  } catch (error) {
    setErrorMessage(error.message || "Impossible de démarrer le trajet");
  } finally {
    setIsSubmitting(false);
  }
}; 

  const PassengerRow = ({ passenger }) => {
    const isPending = passenger.status === "pending";

    return (
      <View style={styles.passengerCard}>
        <View style={styles.passengerTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.passengerName}>{passenger.name}</Text>
            <Text style={styles.passengerMeta}>
              {formatAmount(passenger.amount)}
            </Text>
          </View>

          <View style={[styles.badge, getStatusStyle(passenger.status)]}>
            <Text style={[styles.badgeText, getStatusTextStyle(passenger.status)]}>
              {getStatusLabel(passenger.status)}
            </Text>
          </View>
        </View>

        <View style={styles.passengerBottomRow}>
          <Text style={styles.bookingText}>Booking : {passenger.bookingId}</Text>
        </View>

        {isPending && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleOpenScanner}
            >
              <Text style={styles.scanButtonText}>Scanner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.absentButton}
              onPress={() => handleMarkAbsent(passenger.passengerId)}
            >
              <Text style={styles.absentButtonText}>Absent</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton de test optionnel si tu veux simuler sans caméra */}
        {isPending && (
          <TouchableOpacity
            style={styles.fakeScanButton}
            onPress={() => handleFakeScanPassenger(passenger.bookingId)}
          >
            <Text style={styles.fakeScanButtonText}>
              Simuler scan de {passenger.bookingId}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Passagers à bord</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trajet</Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Départ</Text>
              <Text style={styles.infoValue}>{pickupAddress}</Text>

              <View style={styles.separator} />

              <Text style={styles.infoLabel}>Arrivée</Text>
              <Text style={styles.infoValue}>{dropoffAddress}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résumé</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>En attente : {pendingCount}</Text>
              <Text style={styles.summaryText}>Validés : {validatedCount}</Text>
              <Text style={styles.summaryText}>Absents : {absentCount}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Liste des passagers</Text>

            {passengers.map((passenger) => (
              <PassengerRow key={passenger.passengerId} passenger={passenger} />
            ))}
          </View>

          {!!errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {!!successMessage && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Règle de démarrage</Text>
            <Text style={styles.infoText}>
              Le bouton “Démarrer le trajet” s’active seulement quand tous les
              passagers sont soit validés, soit marqués absents.
            </Text>
          </View>

          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>Debug</Text>
            <Text style={styles.debugLine}>tripId : {tripId}</Text>
            <Text style={styles.debugLine}>
              canStartTrip : {String(canStartTrip)}
            </Text>
            <Text style={styles.debugLine}>
              passengers : {passengers.length}
            </Text>
            <Text style={styles.debugLine}>
              lastScannedBookingId : {lastScannedBookingId || "aucun"}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!canStartTrip || isSubmitting}
            onPress={handleStartTrip}
            style={[
              styles.startButton,
              (!canStartTrip || isSubmitting) && styles.startButtonDisabled,
            ]}
          >
            <Text style={styles.startButtonText}>
              {isSubmitting ? "Démarrage..." : "Démarrer le trajet"}
            </Text>
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

  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 24,
    color: "#111111",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  headerRightPlaceholder: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  infoLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    color: "#111111",
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 14,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  summaryText: {
    fontSize: 15,
    color: "#111111",
    fontWeight: "600",
    marginBottom: 6,
  },

  passengerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 12,
  },

  passengerTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  passengerBottomRow: {
    marginTop: 10,
  },

  passengerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  passengerMeta: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },

  bookingText: {
    fontSize: 13,
    color: "#777777",
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  badgePending: {
    backgroundColor: "#FFF4E5",
  },

  badgeValidated: {
    backgroundColor: "#ECFDF3",
  },

  badgeAbsent: {
    backgroundColor: "#FDECEC",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  badgeTextPending: {
    color: "#B54708",
  },

  badgeTextValidated: {
    color: "#027A48",
  },

  badgeTextAbsent: {
    color: "#B42318",
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 14,
  },

  scanButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  scanButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  absentButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D92D20",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#FFFFFF",
  },

  absentButtonText: {
    color: "#D92D20",
    fontWeight: "700",
    fontSize: 14,
  },

  fakeScanButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  fakeScanButtonText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  errorBox: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FDECEC",
  },

  errorText: {
    color: "#B42318",
    fontSize: 14,
    fontWeight: "600",
  },

  successBox: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ECFDF3",
  },

  successText: {
    color: "#027A48",
    fontSize: 14,
    fontWeight: "600",
  },

  infoBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
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

  debugBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  debugTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  debugLine: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 4,
  },

  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },

  startButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  startButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
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
import { useStripe } from "@stripe/stripe-react-native";

export default function PaymentScreen({ navigation, route }) {
  const amount = route?.params?.amount || 12.5; // montant max affiché
  const currency = route?.params?.currency || "eur";
  const tripId = route?.params?.tripId || "trip_001";

  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // important : garder le paymentIntentId après autorisation
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    setTimeout(() => {
      setSavedCards([]);
      setSelectedCard(null);
      setLoading(false);
    }, 400);
  }, []);

  const hasAtLeastOneSavedCard = savedCards.length > 0;

  const viewState = useMemo(() => {
    if (loading) return "loading";
    if (isSubmitting) return "processingPayment";
    if (paymentSuccess) return "paymentSuccess";
    if (paymentError) return "paymentError";
    if (selectedCard) return "hasSavedCard";
    return "noSavedCard";
  }, [loading, isSubmitting, paymentSuccess, paymentError, selectedCard]);

  const formatAmount = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
  };

  const amountInCents = Math.round(amount * 100);

  const fetchAuthorizePaymentParams = async () => {
    const response = await fetch("http://10.0.2.2:3000/authorize-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur serveur Stripe");
    }

    return data;
  };

  const handleAuthorizePayment = async () => {
    try {
      setPaymentError("");
      setIsSubmitting(true);

      const { paymentIntent, paymentIntentId, ephemeralKey, customer } =
        await fetchAuthorizePaymentParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Buzz",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: "Test User",
        },
      });

      if (error) {
        setIsSubmitting(false);
        setPaymentError(error.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      setIsSubmitting(false);

      if (presentError) {
        setPaymentError(presentError.message);
        return;
      }

      // Succès = autorisation ok, pas capture finale
      setPaymentIntentId(paymentIntentId);
      setPaymentSuccess(true);

      // carte simulée localement pour l'affichage
      const fakeCard = {
        id: "stripe_card_1",
        brand: "Visa",
        last4: "4242",
        expMonth: "12",
        expYear: "34",
        holderName: "Test User",
      };

      setSavedCards([fakeCard]);
      setSelectedCard(fakeCard);

      Alert.alert(
        "Montant autorisé",
        `Le montant maximum de ${formatAmount(amount)} est autorisé. Le montant final sera capturé au départ.`
      );

      // Ici, idéalement :
      // appeler ton backend pour sauvegarder paymentIntentId avec tripId / bookingId
      // ex: POST /save-booking-payment
    } catch (error) {
      setIsSubmitting(false);
      setPaymentError(error.message || "L'autorisation a échoué.");
    }
  };

  const footerLabel = selectedCard
    ? "Confirmer le paiement"
    : `Payer ${formatAmount(amount)}`;

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

          <Text style={styles.headerTitle}>Paiement</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.amountStickyContainer}>
          <Text style={styles.amountLabel}>Montant maximum autorisé</Text>
          <Text style={styles.amountValue}>{formatAmount(amount)}</Text>
          <Text style={styles.amountHelper}>
            Aucun débit immédiat. Le montant final sera capturé au départ.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {viewState === "loading" && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Chargement des moyens de paiement...
              </Text>
            </View>
          )}

          {viewState !== "loading" && hasAtLeastOneSavedCard && selectedCard && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Moyen de paiement</Text>

              <View style={styles.cardBox}>
                <Text style={styles.cardBrandText}>
                  {selectedCard.brand} •••• {selectedCard.last4}
                </Text>
                <Text style={styles.cardMetaText}>
                  Exp. {selectedCard.expMonth}/{selectedCard.expYear}
                </Text>
                <Text style={styles.cardMetaText}>{selectedCard.holderName}</Text>
              </View>
            </View>
          )}

          {viewState !== "loading" && !hasAtLeastOneSavedCard && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Moyen de paiement</Text>

              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Aucune carte enregistrée</Text>
                <Text style={styles.emptyText}>
                  Ajoute une carte pour autoriser le montant maximum.
                </Text>
              </View>
            </View>
          )}

          {!!paymentError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{paymentError}</Text>
            </View>
          )}

          {paymentSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Autorisation réussie. En attente de capture finale.
              </Text>
            </View>
          )}

          {paymentIntentId && (
            <View style={styles.debugBox}>
              <Text style={styles.debugTitle}>Debug</Text>
              <Text style={styles.debugLine}>paymentIntentId : {paymentIntentId}</Text>
              <Text style={styles.debugLine}>tripId : {tripId}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleAuthorizePayment}
            style={[
              styles.mainButton,
              isSubmitting && styles.mainButtonDisabled,
            ]}
          >
            <Text style={styles.mainButtonText}>
              {isSubmitting ? "Autorisation en cours..." : "Confirmer le paiement"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  backText: { fontSize: 24, color: "#111111" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },
  headerRightPlaceholder: { width: 40 },

  amountStickyContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111111",
  },
  amountHelper: {
    marginTop: 8,
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },

  scrollContent: { paddingBottom: 20 },
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },

  cardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardBrandText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },

  infoBox: { padding: 20 },
  infoText: { fontSize: 15, color: "#666666" },

  errorBox: {
    marginHorizontal: 20,
    marginTop: 4,
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
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ECFDF3",
  },
  successText: {
    color: "#027A48",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  mainButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  debugBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
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
});
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useSelector } from "react-redux";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddPaymentMethodScreen({ navigation }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // ✅ adapte selon ton store Redux
  // Ici je suppose que tu stockes le token du user dans state.user.token (à ajuster si besoin)
  const token = useSelector((state) => state.user?.token);

  const handleAddCard = async () => {
    try {
      if (!token) {
        Alert.alert("Connexion requise", "Veuillez vous connecter avant d'ajouter une carte.");
        return;
      }

      setLoading(true);

      // 1) Backend -> SetupIntent + EphemeralKey + Customer
      const r = await fetch(`${API_URL}/payments/setup-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await r.json();
      if (!data.result) throw new Error(data.error);

      const { customerId, ephemeralKeySecret, setupIntentClientSecret } = data;

      // 2) Init PaymentSheet
      const init = await initPaymentSheet({
        merchantDisplayName: "BUZZ",
        customerId,
        customerEphemeralKeySecret: ephemeralKeySecret,
        setupIntentClientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (init.error) throw new Error(init.error.message);

      // 3) Ouvrir PaymentSheet
      const present = await presentPaymentSheet();
      if (present.error) throw new Error(present.error.message);

      // 4) Récupérer setupIntentId à partir du clientSecret (seti_xxx_secret_yyy)
      const setupIntentId = setupIntentClientSecret.split("_secret")[0];

      // 5) Dire au backend : "mets cette carte comme defaultPaymentMethodId"
      const r2 = await fetch(`${API_URL}/payments/attach-default-payment-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, setupIntentId }),
      });

      const data2 = await r2.json();
      if (!data2.result) throw new Error(data2.error);

      Alert.alert("✅ Carte enregistrée", "Votre moyen de paiement est prêt.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erreur paiement", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 10 }}>
        Moyen de paiement
      </Text>

      <Text style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
        Ajoute une carte maintenant. Le paiement final sera débité à la fin du trajet.
      </Text>

      <TouchableOpacity
        onPress={handleAddCard}
        disabled={loading}
        style={{
          backgroundColor: "#ad2831",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "800" }}>Ajouter une carte</Text>
        )}
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: "#777", marginTop: 18 }}>
        Test Stripe : utilisez 4242 4242 4242 4242 — 12/34 — 123
      </Text>
    </View>
  );
}
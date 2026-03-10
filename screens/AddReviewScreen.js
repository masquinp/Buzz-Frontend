import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { addReview } from "../reducers/review";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../utils/formatDate";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddReviewScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const review = useSelector((state) => state.review.value);
  const dispatch = useDispatch();

  const { ride, booking, payment } = route.params;

  const [message, setMessage] = useState("");
  const [note, setNote] = useState(0); // note de 1 à 5

  const newReview = () => {
    if (!payment) return; // Sécurité
    if (note === 0) {
      alert("Veuillez choisir une note !");
      return;
    }
    fetch(`${EXPO_PUBLIC_API_URL}/reviews/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        note: note,
        message: message,
        ride: ride._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addReview(data.review));
          // Navigation vers l'écran suivant après succès
          //  navigation.navigate("Payment", { ride: ride, booking: data.booking });
          alert("Note enregistrée !");
        } else {
          alert(data.error);
        }
      });
  };

  const reviewStars = () => {
    const stars = [];

    // on boucle de 1 à 5
    for (let star = 1; star <= 5; star++) {
      stars.push(
        <TouchableOpacity key={star} onPress={() => setNote(star)}>
          <FontAwesomeIcon
            // Si l'étoile est inférieur ou égale à la note choisie, elle est pleine, sinon vide
            icon={star <= note ? faStar : faStarEmpty}
            size={36}
            // Si l'étoile est inférieur ou égal à la note choisie, elle est jaune, sinon grise
            color={star <= note ? "#F5A623" : "#ccc"}
          />
        </TouchableOpacity>,
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Arrow />
        <View style={styles.container}>
          <Text style={styles.title}>Noter le trajet</Text>
          <Text style={styles.subtitle}>
            {ride.departure} → {ride.arrival}
          </Text>

          <View style={styles.driverCard}>
            <FontAwesomeIcon icon={faCircleUser} size={70} color="#545e63" />
            <Text style={styles.driverName}>
              {ride.user?.firstname} {ride.user?.lastname}
            </Text>
          </View>

          {/* Les 5 étoiles cliquables ici */}
          <View style={styles.starsRow}>{reviewStars()}</View>

          <TextInput
            style={styles.input}
            placeholder="Laissez un commentaire..."
            value={message}
            onChangeText={(text) => setMessage(text)} // met à jour message
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              navigation.navigate("TabNavigator", { screen: "Map" });
              newReview();
            }}
          >
            <Text style={styles.submitButtonText}>Envoyer l'avis</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  driverCard: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    gap: 10,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 30,
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "#A7333F",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

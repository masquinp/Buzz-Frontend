import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reviewUser } from "../reducers/review";
import Review from "../components/review";
import Arrow from "../components/Arrow";

export default function ReviewScreen() {
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.reviews);

  const moyenne =
    reviews.reduce((sum, review) => sum + Number(review.note), 0) /
      reviews.length || 0;

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_API_URL}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(reviewUser(data.reviews));
      }); 
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Arrow />
        <Text style={styles.title}>Mes évaluations</Text>
      </View>
      <View style={styles.globalNote}>
        <Text style={styles.noteNumber}>{moyenne}</Text>
        <Text style={styles.noteText}>Note moyenne</Text>
      </View>
      <ScrollView style={styles.listeBox}>
        {reviews.map((data, i) => (
          <Review
            key={i}
            photo={data.user?.photo}
            name={data.user?.name}
            note={data.note}
            text={data.message}
          />
        ))} 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A7333F",
    textAlign: "center",
  },
  globalNote: {
    alignItems: "center",
    marginBottom: 25,
  },
  noteNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFC107",
  },
  noteText: {
    fontSize: 14,
    color: "#A7333F",
  },
  listeBox: {
    paddingHorizontal: 15,
  },
});

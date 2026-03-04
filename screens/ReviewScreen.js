import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import Review from "../components/review";
import Arrow from "../components/Arrow";

export default function ReviewScreen() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Arrow />
          <Text style={styles.title}>Mes évaluations</Text>
        </View>
        <View style={styles.globalNote}>
          <Text style={styles.noteNumber}>4.5</Text>
          <Text style={styles.noteText}>Note moyenne</Text>
        </View>
        <ScrollView style={styles.listeBox}>
          <Review
            photo=""
            name="Elsa"
            note={4}
            date="02/03/26"
            text="Tres Bien."
          />
          <Review
            photo=""
            name="Margaux"
            note={4.5}
            date="02/03/26"
            text="Super expérience."
          />
          <Review
            photo=""
            name="Pierre"
            note={5}
            date="01/03/26"
            text="Conduite parfaite."
          />
        </ScrollView>
      </View>
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
    color: "#222",
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
    color: "#777",
  },
  listeBox: {
    paddingHorizontal: 15,
  },
});

import { StyleSheet, Text, View, Image } from "react-native";
import review from "../components/review"

export default function ReviewScreen() {


  return (
    <View style={styles.container}>
      <View style={styles.evaluation}> Mes évaluations </View>
      <View style={styles.note}> Note </View>
      <View style={styles.listeBox}> Box </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  evaluation: {
    flex: 1,
  },
  note: {
    flex: 1,
  },
  listeBox: {
    flex: 1,
  }
});

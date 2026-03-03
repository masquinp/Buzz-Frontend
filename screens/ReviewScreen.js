import { StyleSheet, Text, View, Image } from "react-native";
import review from "../components/review";

export default function ReviewScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.evaluation}>
        <Text> Mes évaluations </Text>
      </View>
      <View style={styles.note}>
        <Text> Note </Text>
      </View>
      <View style={styles.listeBox}>
        <Text> Box</Text>
      </View>
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
  },
});

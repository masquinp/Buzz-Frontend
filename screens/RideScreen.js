import { StyleSheet, Text, View, Image } from "react-native";
import ride from "../components/ride";

export default function ReviewScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.evaluation}>
        <Text> Trajets Disponible</Text>
      </View>
      <View style={styles.listeBox}>
        <Text> Box </Text>
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
  listeBox: {
    flex: 1,
  },
});

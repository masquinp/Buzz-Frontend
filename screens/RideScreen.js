import { StyleSheet, Text, View, ScrollView } from "react-native";
import Ride from "../components/ride";

export default function RideScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.trajetText}>Trajets disponibles</Text>
      </View>
      <ScrollView style={styles.listeBox}>
        <Ride
          photo=""
          name="Margaux"
          car="BMW Série 3"
          note={4.5}
          date="06/03/26"
          price="19$"
        />
        <Ride
          photo=""
          name="Elsa"
          car="Audi A4"
          note={5}
          date="07/03/26"
          price="25$"
        />
        <Ride
          photo=""
          name="Pierre"
          car="Volkswagen"
          note={4}
          date="08/03/26"
          price="22$"
        />
      </ScrollView>
    </View>
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
  trajetText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center"
  },
  listeBox: {
    paddingHorizontal: 15,
  },
});

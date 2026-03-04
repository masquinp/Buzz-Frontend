import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ride from "../components/ride";
import Arrow from "../components/Arrow";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Arrow />
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
  trajetText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  listeBox: {
    paddingHorizontal: 15,
  },
});

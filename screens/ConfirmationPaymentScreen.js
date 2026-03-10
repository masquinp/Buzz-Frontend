import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ConfirmationPaymentScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <View style={styles.container}>
        <Arrow />
        <Text>Paiment confirmé !</Text>
        <Text>Votre chauffeur est en route.</Text>
        <Text>Contactez votre chauffeur</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Messages");
          }}
        >
          <Text>
            <FontAwesome name="comments" size={20} color="black" />;
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TabNavigator", { screen: "Map" })}
        >
          <Text>Retournez sur la page d'accueil</Text>
        </TouchableOpacity>
      </View>
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
});

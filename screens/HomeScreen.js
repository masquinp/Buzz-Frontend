import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/image4.png")}
        accessibilityLabel="Logo de l'application Buzz, une voiture sur la route"
      ></Image>
      <View>
        <TouchableOpacity
          style={styles.connectionBtn}
          onPress={() => navigation.navigate("Connection")}
          accessibilityRole="button"
          accessibilityLabel="Se connecter à mon compte"
        >
          <Text style={styles.textBtn}> Connexion </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inscriptionBtn}
          onPress={() => navigation.navigate("Register")}
          accessibilityRole="button"
          accessibilityLabel="Créer un compte"
        >
          <Text style={styles.textBtn}> Inscription </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6f0",
    alignItems: "center",
    justifyContent: "center",
  },
  textBtn: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
  },
  connectionBtn: {
    backgroundColor: "#A7333F",
    margin: "20",
    borderRadius: 50,
    padding: 10,
  },

  inscriptionBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 50,
    padding: 10,
  },

  image: {
    width: 400,
    height: 550,
  },
});

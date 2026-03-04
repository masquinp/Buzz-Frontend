import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.temporary}>
        <TouchableOpacity onPress={() => navigation.navigate("Ride")}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Review")}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.p}>P</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={require("../assets/image4.png")}
      ></Image>
      {/* <View>
        <Text style={styles.title}>BUZZ</Text>
        <Text style={styles.message}>Welcome to our app !</Text>
      </View> */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.connectionBtn}
          onPress={() => navigation.navigate("Connection")}
        >
          <Text style={styles.textBtn}> Connection </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inscriptionBtn}
          onPress={() => navigation.navigate("Register")}
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
  title: {
    fontSize: 60,
    fontWeight: "bold",
  },
  message: {
    fontSize: 30,
  },
  textBtn: {
    fontSize: 35,
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
  temporary: {
    flexDirection: "row",
  },
  p: {
    fontSize: 30,
  },
});

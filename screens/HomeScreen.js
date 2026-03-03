import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>BUZZ</Text>
        <Text style={styles.message}>Welcome to our app !</Text>
      </View>
      <View >
        <TouchableOpacity onPress={() => navigation.navigate("Connection")}>
          <Text style={styles.connectionBtn}> Connection </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.inscriptionBtn}> Inscription </Text>
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
  title: {
    fontSize: 60,
  },
  message: {
    fontSize: 30,
  },
  connectionBtn: {
    fontSize: 25,
  },
  inscriptionBtn: {
    fontSize: 25,
  }
  

});

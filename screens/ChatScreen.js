import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, } from "react-native";
import Arrow from "../components/Arrow";

export default function TestScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Arrow />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex:1,
    },
    container: {
        flex: 1,
       
    }
});

import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
       <Text>Bookings Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 60,
  },
});

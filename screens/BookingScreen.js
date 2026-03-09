import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Arrow from "../components/Arrow";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector } from "react-redux";
import { formatDate } from "../utils/formatDate";

export default function BookingScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const { ride } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <View style={styles.container}>
        <Arrow />
        <Text>
          {ride.user?.firstname} {ride.user?.lastname}
        </Text>
        <Text>
          {ride.departure} ➔ {ride.arrival}
        </Text>
        <Text>{formatDate(ride.date)}</Text>
        <Text>{ride.price}€</Text>
        <Text>
          {ride.user?.car
            ? `${ride.user.car.brand} ${ride.user.car.model} ${ride.user.car.color}`
            : "Voiture non renseignée"}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Booking", { rideId: ride._id })}
        >
          <Text>Réservez</Text>
        </TouchableOpacity>
        <TouchableOpacity >
          <Text>Annulez</Text>
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

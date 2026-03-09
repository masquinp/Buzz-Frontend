import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function PassengerHomeScreen({ navigation }) {
  const cars = [
    {
      id: "car_1",
      driverName: "Sophie Martin",
      coordinate: {
        latitude: 48.864716,
        longitude: 2.349014,
      },
      amount: 8.5,
    },
    {
      id: "car_2",
      driverName: "Mehdi Ben",
      coordinate: {
        latitude: 48.8665,
        longitude: 2.3522,
      },
      amount: 7.2,
    },
    {
      id: "car_3",
      driverName: "Chloé Durand",
      coordinate: {
        latitude: 48.8628,
        longitude: 2.3458,
      },
      amount: 6.8,
    },
    {
      id: "car_4",
      driverName: "Nina Robert",
      coordinate: {
        latitude: 48.8684,
        longitude: 2.3561,
      },
      amount: 9.1,
    },
  ];

  const initialRegion = {
    latitude: 48.864716,
    longitude: 2.349014,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleCarPress = (car) => {
    navigation.navigate("RideSummary", {
      tripId: `trip_${car.id}`,
      driverName: car.driverName,
      pickupAddress: "12 rue Oberkampf, Paris",
      dropoffAddress: "25 avenue de Clichy, Paris",
      amount: car.amount,
      currency: "eur",
      carId: car.id,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header flottant */}
        <View style={styles.topOverlay}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Text style={styles.searchText}>recherche de trajet</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* MAP */}
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsCompass={false}
          showsScale={false}
        >
          {cars.map((car) => (
            <Marker
              key={car.id}
              coordinate={car.coordinate}
              onPress={() => handleCarPress(car)}
            >
              <View style={styles.customMarker}>
                <Text style={styles.customMarkerText}>🚘</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Bouton mode conducteur */}
        <View style={styles.driverModeWrapper}>
          <TouchableOpacity
            style={styles.driverModeButton}
            onPress={() => navigation.navigate("DriverHome")}
          >
            <Text style={styles.driverModeButtonText}>
              PASSER EN MODE CONDUCTEUR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation.navigate("MyRides")}
          >
            <Text style={styles.bottomIcon}>🚗</Text>
            <Text style={styles.bottomLabel}>Vos trajets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation.navigate("Messages")}
          >
            <Text style={styles.bottomIcon}>💬</Text>
            <Text style={styles.bottomLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  map: {
    flex: 1,
  },

  topOverlay: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  iconText: {
    fontSize: 20,
    color: "#111111",
    fontWeight: "700",
  },

  searchBar: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 10,
    justifyContent: "center",
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  searchText: {
    fontSize: 14,
    color: "#666666",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  profileIcon: {
    fontSize: 18,
  },

  customMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E0F2FE",
    borderWidth: 2,
    borderColor: "#60A5FA",
    alignItems: "center",
    justifyContent: "center",
  },

  customMarkerText: {
    fontSize: 18,
  },

  driverModeWrapper: {
    position: "absolute",
    bottom: 72,
    left: 20,
    right: 20,
    zIndex: 20,
  },

  driverModeButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  driverModeButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  bottomBar: {
    height: 78,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  bottomIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  bottomLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
});
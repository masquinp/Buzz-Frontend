import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Ride(props) {
  return (
    <View style={styles.boxCard}>
      <Image source={{ uri: props.photo }} style={styles.photo} />

      <View style={styles.content}>
        <Text style={styles.nameText}>
          {props.firstname} {props.lastname}
        </Text>

        <Text style={styles.carText}>{props.car}</Text>

        <Text style={styles.dateText}>{props.date}</Text>
      </View>

      {/* Cercle prix */}
      <View style={styles.priceCircle}>
        <Text style={styles.priceText}>{props.price}€</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10, // réduit l'espace entre chaque Ride
  },

  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#000",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  carText: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },

  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  priceCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff", 
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 3,          
    borderColor: "#2ecc71",  
  },

  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#2ecc71',       
  },
});
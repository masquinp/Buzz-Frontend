import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Ride (props) {
    return (
        <View style={styles.boxCard}>
            <Image source={{ uri: props.photo }} style={styles.photo} />
          <View styles={styles.firstCard}>
                <Text style={styles.nameText}>{props.name}</Text>
                <Text style={styles.carText}>{props.car}</Text>
            <View style={styles.secondCard}>
              <Text style={styles.noteText}>{props.note}/5</Text>
              <Text style={styles.dateText}>{props.date}</Text>
              <Text style={styles.priceText}>{props.price}</Text>
            </View>
          </View>   
        </View>
    );
    }

    const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  boxCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
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
    justifyContent: "space-between",
  },

  header: {
    marginBottom: 8,
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

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f5a623",
  },

  dateText: {
    fontSize: 12,
    color: "#999",
  },

  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2ecc71",
  },
});
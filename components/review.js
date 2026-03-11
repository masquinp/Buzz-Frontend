import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Review (props) {
 return (
    <View style={styles.boxCard}>
      <Image source={{ uri: props.photo }} style={styles.photo} />
      <View style={styles.contentCard}>
        <Text style={styles.nameText}>{props.firstname} {props.lastname}</Text>

        <View style={styles.Box}>
          <Text style={styles.noteText}>{props.note}/5</Text>
          <Text style={styles.dateText}>{props.date}</Text>
        </View>

        <Text style={styles.messageText}>{props.text}</Text>
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
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#000",
  },

  contentCard: {
    flex: 1,
  },

  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  starContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontSize: 14,
    color: "#FFC107",
    marginRight: 2,
  },

  noteText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  dateText: {
    fontSize: 12,
    color: "#999",
  },

  messageText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
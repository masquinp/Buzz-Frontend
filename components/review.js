import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Review(props) {
  return (
    <View style={styles.boxCard}>
      <Image source={{ uri: props.photo }} style={styles.photo} />

      <View style={styles.contentCard}>
        <Text style={styles.nameText}>
          {props.firstname} {props.lastname}
        </Text>

        <Text style={styles.dateText}>{props.date}</Text>

        <Text style={styles.messageText}>{props.text}</Text>
      </View>

      {/* Cercle note */}
      <View style={styles.noteCircle}>
        <Text style={styles.noteText}>{props.note}/5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
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
    marginBottom: 4,
  },

  dateText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },

  messageText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  noteCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#A7333F",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  noteText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
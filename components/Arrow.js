import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Arrow() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
      <FontAwesomeIcon icon={faArrowLeft} size={24} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
});

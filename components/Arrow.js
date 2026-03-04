import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Arrow({color= '#000', top= 20}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={[styles.arrow, {top: top}]} onPress={() => navigation.goBack()}>
      <FontAwesomeIcon icon={faArrowLeft} size={24} color = {color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
});

import { StyleSheet, Text, View, Image } from "react-native";

export default function ReviewScreen() {


  return (
    <View style={styles.container}>
      <View style={styles.evaluation}> Mes évaluations </View>
      <View style={styles.note}> Note </View>
      <View style={styles.listeBox}> Box </View>
    </View>
  );
}

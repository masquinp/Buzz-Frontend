import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Arrow from "../components/Arrow";

export default function TestScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
     <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Messages</Text>
      <Text style={{ marginTop: 10, opacity: 0.7 }}>
        (À brancher sur /conversations + /messages)
      </Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex:1,
    },
    container: {
        flex: 1,
       
    }
});

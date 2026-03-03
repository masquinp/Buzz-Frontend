import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function ReviewScreen(props) {

  const reviewBox = () => (
    <View style={styles.boxCard}>
      <Image 
        source={{ uri: props.photo }} 
        style={styles.photo} 
      />

      <View style={styles.contentCard}>
        <Text style={styles.nameText}>{props.name}</Text>

        <View style={styles.Box}>
          <Text style={styles.noteText}>{props.note}/5</Text>
          <Text style={styles.dateText}>{props.date}</Text>
        </View>

        <Text style={styles.messageText}>{props.text}</Text>
      </View>   
    </View>
  );
}
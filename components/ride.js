import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function ReviewScreen(props) {
    const reviewBox = () => (
        <View style={styles.boxCard}>
            <Image source={{ uri: props.photo }} styles={style.photo} />
          <View styles={style.firstCard}>
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
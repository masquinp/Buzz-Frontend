import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { loadMessages } from "../reducers/messages";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

// screen pour afficher les messages de plusieurs conversations, au clique sur une conversation, navigate sur ChatScreen
// bouton contacter le chauffeur, qui navigate sur ChatScreen aussi
export default function MessagesScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const messages = useSelector((state) => state.messages.value);

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_API_URL}/messages/conversations/${user.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadMessages(data.messages));
        }
      });
  }, []);

  // On affiche chaque message comme une conversation
  const conversationList = messages.map((msg, i) => {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Ouvrir la conversation avec cet utilisateur"
        key={i}
        style={styles.card}
        onPress={() =>
          navigation.navigate("ChatScreen", { bookingId: msg.booking })
        }
      >
        <Text style={styles.username}>{msg.user?.username}</Text>
        <Text style={styles.lastMessage}>{msg.message}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={{ backgroundColor: "fff" }}>
      <View style={styles.container}></View>

      <Text style={styles.title}>Mes conversations</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {messages.length === 0 ? (
          <Text style={styles.empty}>Aucune conversation</Text>
        ) : (
          conversationList
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    color: "#A7333F",
    top: 30,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  lastMessage: {
    color: "#888",
    fontSize: 14,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, useDispatch } from "react-redux";

import { loadConversations } from "../reducers/conversations";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

// screen pour afficher les messages de plusieurs conversations, au clique sur une conversation, navigate sur ChatScreen
// bouton contacter le chauffeur, qui navigate sur ChatScreen aussi
export default function MessagesScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const conversations = useSelector((state) => state.conversations.value);

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_API_URL}/messages/conversations/${user.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadConversations(data.messages)); // on stocke les conversations dans le store
        }
      });
  }, []);

  // On affiche chaque message comme une conversation
  const conversationList = conversations.map((conversations, i) => {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Ouvrir la conversation avec cet utilisateur"
        key={i}
        style={styles.card}
        onPress={() =>
          navigation.navigate("Chat", { // navige en passant les infos nécessaires pour afficher la bonne conv 
            bookingId: conversations.booking?._id,
            receiverId: conversations.receiver?._id,
            senderId: conversations.sender?._id,
          })
        }
      >
        <Text style={styles.username}>{conversations.sender?.username}</Text> 
        <Text style={styles.username}>{conversations.receiver?.username}</Text>
        <Text style={styles.lastMessage}>{conversations.message}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}></View>

      <Text style={styles.title}>Mes conversations</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        { /* Si aucune conversation, on affiche un message, sinon on affiche la liste des conversations */ }
        {conversations.length === 0 ? (
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
    marginBottom: 30,
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

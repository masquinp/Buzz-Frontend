import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Arrow from "../components/Arrow";

import { addMessage, loadMessages } from "../reducers/messages";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ChatScreen({ route }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const messages = useSelector((state) => state.messages.value);

  const bookingId = route.params?.bookingId;
  const receiverId = route.params?.receiverId;
  const senderId = route.params?.senderId;

  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // fetch immédiat au montage avec les bons messages
    fetch(`${EXPO_PUBLIC_API_URL}/messages/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadMessages(data.messages));
        }
      });

    // puis polling toutes les 3 secondes
    const interval = setInterval(() => {
      fetch(`${EXPO_PUBLIC_API_URL}/messages/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            dispatch(loadMessages(data.messages));
          }
        });
    }, 3000); // affiche les nouveaux messages toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (inputText === "") return;

    fetch(`${EXPO_PUBLIC_API_URL}/messages/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        message: inputText,
        booking: bookingId,
        receiver: receiverId,
        sender: senderId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addMessage(data.message));
          setInputText("");
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Arrow top={80} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Chat</Text>

        <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
          {messages.map((msg, i) => {
            const isMe = msg.sender?.username === user.username;

            if (isMe) {
              return (
                <View key={i} style={styles.myMessage}>
                  <Text style={styles.myText}>{msg.message}</Text>
                </View>
              );
            } else {
              return (
                <View key={i} style={styles.otherMessage}>
                  <Text style={styles.username}>{msg.username}</Text>
                  <Text style={styles.otherText}>{msg.message}</Text>
                </View>
              );
            }
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            accessibilityLabel="Écrire un message"
            style={styles.input}
            placeholder="Écrire un message..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            accessibilityRole="button"
            accessibilityLabel="Envoyer le message"
          >
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    color: "#A7333F",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  myMessage: {
    backgroundColor: "#A7333F",
    alignSelf: "flex-end",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    maxWidth: "75%",
  },
  otherMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    maxWidth: "75%",
  },
  myText: {
    color: "#fff",
    fontSize: 15,
  },
  otherText: {
    color: "#000",
    fontSize: 15,
  },
  username: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: "#A7333F",
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
});

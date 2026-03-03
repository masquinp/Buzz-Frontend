import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function Profile() {
  return (
    <View style={styles.boxContainer}>
      <View styles={styles.firstBox}>
        <Text style={styles.carText}>Mon Compte</Text>
        <Image source={{ uri: props.photo }} style={styles.photo} />
        <Text style={styles.nameText}>{props.name}</Text>

        <View style={styles.secondBox}>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mes informations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mes évaluation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Mes préférence</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Sécurité</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Trajets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>Paiement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 70,
  },

  profileBox: {
    alignItems: "center",
    marginBottom: 30,
  },

  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },

  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },

  menuBox: {
    paddingHorizontal: 20,
  },

  button: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  textButton: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});


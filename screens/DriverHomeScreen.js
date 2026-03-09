import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, FlashMode, Camera } from "expo-camera";

import Arrow from "../components/Arrow";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { addPhoto, removePhoto, addCar } from "../reducers/users";
import { useIsFocused } from "@react-navigation/native";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const user = useSelector((state) => state.user.value);

  const formData = new FormData();

  // Reference to the camera
  const cameraRef = useRef(null);

  // const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // null = aucune modal ouverte
  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [nbSeats, setNbSeats] = useState(0);
  const [licencePlate, setLicencePlate] = useState("");

  // Permission hooks
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  const hasPhoto = user.photos && user.photos.length > 0;
  const hasCar = !!user.car;

  // Effect hook to check permission upon each mount
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  if (!hasPermission || !isFocused) {
    return (
      <SafeAreaView>
        <Text>Permission caméra requise</Text>
      </SafeAreaView>
    );
  }

  // Functions to toggle camera facing and flash status
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    // 1. Déclenchement de la prise de vue.
    // On utilise 'await' pour attendre que l'appareil photo termine l'enregistrement de l'image.
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.3, // On réduit la qualité pour que l'upload soit plus rapide
    });

    // 2. Sécurité : On vérifie que la photo a bien été prise avant de continuer
    if (photo) {
      // pour afficher la photo directement
      dispatch(addPhoto(photo.uri));
      // 3. Préparation du "paquet" (FormData) pour l'expédition au backend.
      // Le FormData est nécessaire pour envoyer des fichiers via HTTP.
      const formData = new FormData();

      // On ajoute un champ "photoFromFront" qui doit correspondre au nom
      // attendu par ton backend (ex: dans ton routeur avec 'formidable' ou 'multer')
      formData.append("photoFromFront", {
        uri: photo.uri, // Le chemin local temporaire sur le téléphone
        name: "photo.jpg", // Le nom que le fichier aura sur le serveur
        type: "image/jpeg", // Le type MIME pour que le serveur sache que c'est une image
      });
      formData.append("token", user.token);

      // 4. Envoi de la photo vers le serveur local (Backend)
      fetch(`${EXPO_PUBLIC_API_URL}/users/upload`, {
        method: "POST",
        body: formData, // On passe le FormData ici. Pas besoin de 'headers', fetch le gère seul.
      })
        .then((response) => response.json()) // On convertit la réponse brute du serveur en objet JSON
        .then((data) => {
          // 5. Traitement de la réponse du backend
          // data.result : vérifie si l'upload sur Cloudinary a réussi côté serveur
          if (data.result) {
            /* CRUCIAL : Au lieu de dispatcher 'photo.uri' (qui est temporaire),
             on dispatche 'data.url' (ou la clé renvoyée par ton serveur).
             C'est l'URL permanente stockée sur Cloudinary.
          */
            dispatch(addPhoto(data.url));
            console.log("Photo sauvegardée sur le cloud :", data.url);
          }
        });
    }
  };

  const photos = user.photos?.map((data, i) => {
    return (
      <View key={i} style={styles.photoContainer}>
        <TouchableOpacity onPress={() => deletePicture(data)}>
          <FontAwesome
            name="times"
            size={20}
            color="#000000"
            style={styles.deleteIcon}
          />
        </TouchableOpacity>

        <Image source={{ uri: data }} style={styles.photo} />
      </View>
    );
  });

  const deletePicture = (photoUrl) => {
    if (!user.token) {
      alert("Erreur : Utilisateur non identifié. Reconnectez-vous.");
      return;
    }
    fetch(`${EXPO_PUBLIC_API_URL}/users/deletePicture`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        url: photoUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(removePhoto(photoUrl));
          alert("Photo supprimé");
        } else {
          alert(data.error);
        }
      });
  };

  const newCar = () => {
    if (!user._id) {
      alert("Erreur : Utilisateur non identifié. Reconnectez-vous.");
      return;
    }
    fetch(`${EXPO_PUBLIC_API_URL}/users/addCar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        brand,
        model,
        color,
        nbSeats,
        licencePlate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          dispatch(addCar(data.car));
          alert("Voiture ajoutée !");
          // Navigation vers l'écran suivant après succès
          // navigation.navigate("TabNavigator", { screen: "Map" });
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0e2e4" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#cbdee1" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Modal visible={activeModal === "camera"} animationType="slide">
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              ref={cameraRef}
              facing={facing}
              flash={flash}
            />

            <TouchableOpacity
              onPress={() => closeModal()}
              style={{
                top: 80,
                left: 30,
                position: "absolute",
              }}
            >
              <FontAwesomeIcon icon={faXmark} size={50} color="white" />
            </TouchableOpacity>
            <View style={styles.cameraButtons}>
              <TouchableOpacity
                style={styles.flashButton}
                onPress={toggleFlash}
              >
                <FontAwesome name="flash" size={30} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={async () => {
                  await takePicture(); // on attend que la photo soit prise
                  closeModal();
                }}
              >
                <FontAwesome name="circle-thin" size={90} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rotateButton}
                onPress={toggleCameraFacing}
              >
                <FontAwesome name="rotate-right" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* MODALE 2 : AJOUT VOITURE */}
        <Modal
          visible={activeModal === "car"}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={closeModal}
                style={{ alignSelf: "flex-end" }}
              >
                <FontAwesomeIcon icon={faXmark} size={30} color="#A7333F" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Ma Voiture</Text>

              <TextInput
                placeholder="Marque"
                style={styles.input}
                onChangeText={setBrand}
                value={brand}
              />
              <TextInput
                placeholder="Modèle"
                style={styles.input}
                onChangeText={setModel}
                value={model}
              />
              <TextInput
                placeholder="Couleur"
                style={styles.input}
                onChangeText={setColor}
                value={color}
              />
              <TextInput
                placeholder="Nombre de places"
                style={styles.input}
                onChangeText={setNbSeats}
                value={nbSeats}
              />
              <TextInput
                placeholder="Plaque d'immatriculation"
                style={styles.input}
                onChangeText={setLicencePlate}
                value={licencePlate}
              />

              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => {
                  (newCar(), closeModal(), navigation.goBack());
                }}
              >
                <Text style={styles.textBtn}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />

        <ScrollView contentContainerStyle={{ top: 60 }}>
          <View style={styles.header}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#A7333F",
                textAlign: "center",
              }}
            >
              Espace Conducteur
            </Text>
            <Text style={{ fontSize: 15, color: "#888", margin: 15 }}>
              Complétez votre profil pour proposer des trajets
            </Text>
          </View>
          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>📄 Mon permis de conduire</Text>
            <Text style={styles.blocDesc}>
              Prenez une photo de votre permis
            </Text>
            <TouchableOpacity
              style={[styles.btn, hasPhoto && styles.btnDone]}
              onPress={() => openModal("camera")}
            >
              <Text style={styles.btnText}>
                {hasPhoto ? "✓ Document ajouté" : "📷 Prendre une photo"}
              </Text>
            </TouchableOpacity>

            {hasPhoto && <View style={styles.photoContainer}>{photos}</View>}
          </View>

          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>🚗 Ma voiture</Text>
            <Text style={styles.blocDesc}>
              Ajoutez les infos de votre véhicule
            </Text>
            <TouchableOpacity
              style={[styles.btn, hasCar && styles.btnDone]}
              onPress={() => openModal("car")}
            >
              <Text style={styles.btnText}>
                {hasCar
                  ? `✓ ${user.car.brand} ${user.car.model}`
                  : "Ajouter ma voiture"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>🗺️ Proposer un trajet</Text>
            <Text style={styles.blocDesc}>
              {hasPhoto && hasCar
                ? "Vous êtes prêt à proposer un trajet !"
                : "Complétez les étapes ci-dessus d'abord"}
            </Text>
            <TouchableOpacity
              style={[styles.btn, !(hasPhoto && hasCar) && styles.btnDisabled]}
              disabled={!(hasPhoto && hasCar)}
              onPress={() => navigation.navigate("AddRide")}
            >
              <Text style={styles.btnText}>Créer un trajet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingTop: 80,
    gap: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#A7333F",
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  bloc: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    gap: 8,
    margin: 7,
  },
  blocTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  blocDesc: {
    fontSize: 13,
    color: "#888",
  },
  btn: {
    backgroundColor: "#A7333F",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  btnDone: {
    backgroundColor: "#274928",
  },
  btnDisabled: {
    backgroundColor: "#ccc",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    width: 250,
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  textBtn: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
  },
  registerBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#d7bebe",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
    height: "65%",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cameraButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  photo: {
    margin: 5,
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
});

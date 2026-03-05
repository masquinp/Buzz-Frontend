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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, FlashMode, Camera } from "expo-camera";

import Arrow from "../components/Arrow";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faXmark,
  faCamera,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { addPhoto, removePhoto } from "../reducers/users";
import { useIsFocused } from "@react-navigation/native";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const user = useSelector((state) => state.user.value);
  const rides = useSelector((state) => state.rides.value);

  const formData = new FormData();

  // Reference to the camera
  const cameraRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // null = aucune modal ouverte

  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [nbSeats, setNbSeats] = useState(0);
  const [licencePlate, setLicencePlate] = useState("");

  // Permission hooks
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  // Effect hook to check permission upon each mount
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  // Conditions to prevent more than 1 camera component to run in the bg
  /* if (!hasPermission || !isFocused) {
    return <View />;
  }
    */

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
      // 3. Préparation du "paquet" (FormData) pour l'expédition au backend.
      // Le FormData est nécessaire pour envoyer des fichiers via HTTP.
      const formData = new FormData();

      // On ajoute un champ "photoFromFront" qui doit correspondre au nom
      // attendu par ton backend (ex: dans ton routeur avec 'formidable' ou 'multer')
      //@ts-ignore
      formData.append("photoFromFront", {
        uri: photo.uri, // Le chemin local temporaire sur le téléphone
        name: "photo.jpg", // Le nom que le fichier aura sur le serveur
        type: "image/jpeg", // Le type MIME pour que le serveur sache que c'est une image
      });

      // 4. Envoi de la photo vers ton serveur local (Backend)
      // Remplace bien l'IP par la tienne si elle change (ipconfig / ifconfig)
      fetch(`${EXPO_PUBLIC_API_URL}/upload`, {
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
        <TouchableOpacity onPress={() => dispatch(removePhoto(data))}>
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

  const showModal = (ride) => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Modal visible={modalVisible} animationType="fade">
          <View style={{ flex: 1 }}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              facing={facing}
              flash={flash}
            />

            <TouchableOpacity
              onPress={() => closeModal()}
              style={styles.closeModal}
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
                style={styles.captureButton}
                onPress={takePicture}
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
        <Arrow />
        <View styles={styles.addDoc}>
          <Text>Ajouter vos documents : </Text>
          <TouchableOpacity onPress={() => showModal()}>
            <FontAwesomeIcon icon={faCamera} size={50} color="#000" />
          </TouchableOpacity>
        </View>
        <Text>Vos photos</Text>
        <ScrollView contentContainerStyle={styles.galleryContainer}>
          {photos}
        </ScrollView>
        {/* si l'utilisateur n'a mis aucune photo, on renvoie ce text :*/}
        {user.photos && user.photos.length > 0 ? (
          photos
        ) : (
          <Text>Aucune photo téléchargée</Text>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("AddRide")}>
          <Text style={styles.title}>Ajoutez un trajet</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6f0",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
  },
  input: {
    width: 250,
    marginTop: 25,
    borderColor: "#A7333F",
    borderBottomWidth: 1,
    fontSize: 20,
  },
  textBtn: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },

  title: {
    fontSize: 25,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  addDoc: {
    flexDirection: "row",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    alignItems: "center",
  },
  cameraButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  closeModal: {
    top: 80,
    left: 30,
    position: "absolute",
  },
  galleryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});

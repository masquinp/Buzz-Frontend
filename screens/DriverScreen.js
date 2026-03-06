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
import {
  faCircleUser,
  faXmark,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { addPhoto, removePhoto, addCar } from "../reducers/users";
import { useIsFocused } from "@react-navigation/native";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TestScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const user = useSelector((state) => state.user.value);
  // const rides = useSelector((state) => state.rides.value);

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
      formData.append("token", user.token);

      // 4. Envoi de la photo vers ton serveur local (Backend)
      // Remplace bien l'IP par la tienne si elle change (ipconfig / ifconfig)
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Modal visible={activeModal === "camera"} animationType="slide">
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
                  (newCar(), closeModal());
                }}
              >
                <Text style={styles.textBtn}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Arrow />

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.addDoc}>
            <Text style={styles.text}>Vous souhaitez ajouter un trajet ?</Text>
            <Text style={styles.text}>
              Enregistrer d'abord votre permis de conduire en cliquant sur la
              caméra.
            </Text>
            <Text style={styles.text}>Ajouter vos documents : </Text>
            <TouchableOpacity onPress={() => openModal("camera")}>
              <FontAwesomeIcon icon={faCamera} size={50} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Vos photos</Text>

          {/* si l'utilisateur n'a mis aucune photo, on renvoie ce text :*/}
          {user.photos && user.photos.length > 0 ? (
            photos
          ) : (
            <Text>Aucune photo téléchargée</Text>
          )}

          <Text>
            Voiture enregistrée :{" "}
            {user.car ? `${user.car.brand} ${user.car.model}` : "Aucune"}
          </Text>
          <TouchableOpacity onPress={() => openModal("car")}>
            <Text style={styles.title}>Ajoutez votre voiture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!user.photos || user.photos.length === 0) {
                alert("Veuillez d'abord ajouter votre permis de conduire.");
                return;
              }
              navigation.navigate("AddRide");
            }}
          >
            <Text style={styles.title}>Ajoutez un trajet</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf6f0",
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
    width: "85%",
    height: "65%",
    justifyContent: "space-between",
  },
  addDoc: {
    marginTop: 80,
  },
  text: {
    fontSize: 15,
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

  photo: {
    margin: 10,
    width: 100,
    height: 100,
  },
  photoContainer: {
    flexDirection: "row",
  },
});

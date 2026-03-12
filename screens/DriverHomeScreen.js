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

  const formData = new FormData(); // pour préparer l'envoi de la photo au backend

  // ref à la caméra
  const cameraRef = useRef(null);

  const [activeModal, setActiveModal] = useState(null); // null = aucune modal ouverte
  const openModal = (type) => setActiveModal(type); // type peut être "camera" ou "car"
  const closeModal = () => setActiveModal(null); // on ferme en remettant à null

  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [nbSeats, setNbSeats] = useState(0);
  const [licencePlate, setLicencePlate] = useState("");

  // Permission hooks
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back"); // caméra arrière par défaut
  const [flash, setFlash] = useState("off"); // flash off par défaut

  const hasPhoto = user.photos && user.photos.length > 0; // vérifie si l'utilisateur a déjà une photo
  const hasCar = !!user.car; // vérifie si l'utilisateur a déjà une voiture enregistrée

  // demande de permission pour accéder à la caméra à l'ouverture du composant
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync(); // demande de permission
      setHasPermission(result && result?.status === "granted"); // on met à jour le state en fonction de la réponse
    })();
  }, []);

  // si pas de permission ou si l'écran n'est pas au premier plan, on affiche un message
  // if (!isFocused) {
  //   return (
  //     <SafeAreaView>
  //       <Text>Permission caméra requise</Text>
  //     </SafeAreaView>
  //   );
  // }

  if (!hasPermission) {
    return (
      <SafeAreaView>
        <Text>Permission caméra requise</Text>
      </SafeAreaView>
    );
  }

  // fonctions pour les boutons de la caméra
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

   const takePicture = async () => {
    // déclenchement de la prise de vue
    // On utilise 'await' pour attendre que l'appareil photo termine l'enregistrement de l'image.
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.3, // On réduit la qualité pour que l'upload soit plus rapide
    });

    // On vérifie que la photo a bien été prise avant de continuer (sécurité)
    if (photo) {
      // pour afficher la photo directement
      dispatch(addPhoto(photo.uri));
      // on prépare le "paquet" (FormData) pour l'expédition au backend.
      // Le FormData est nécessaire pour envoyer des fichiers via HTTP.
      const formData = new FormData();

      // On ajoute un champ "photoFromFront" qui doit correspondre au nom
      // attendu par le backend
      formData.append("photoFromFront", {
        uri: photo.uri, // Le chemin local temporaire sur le téléphone
        name: "photo.jpg", // Le nom que le fichier aura sur le serveur
        type: "image/jpeg", // Le type pour que le serveur sache que c'est une image
      });
      formData.append("token", user.token);

      // envoi de la photo vers le serveur local (Backend)
      fetch(`${EXPO_PUBLIC_API_URL}/users/upload`, {
        method: "POST",
        body: formData, // On passe le FormData ici. Pas besoin de 'headers', fetch le gère seul.
      })
        .then((response) => response.json()) // On convertit la réponse brute du serveur en objet JSON
        .then((data) => {
          // traitement de la réponse du backend
          // vérifie si l'upload sur Cloudinary a réussi côté serveur
          if (data.result) {
            /* Au lieu de dispatcher 'photo.uri' (qui est temporaire),
             on dispatche 'data.url' (ou la clé renvoyée par ton serveur).
             c'est l'URL permanente stockée sur Cloudinary.
          */
             dispatch(addPhoto(data.url));
         }
        });
    }
   }; 

  const deletePicture = (photoUrl) => {
    // photoUrl est l'URL de la photo à supprimer
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
          dispatch(removePhoto(photoUrl)); // on met à jour le state en supprimant la photo
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
        nbSeats: Number(nbSeats), // conversion en nombre
        licencePlate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          dispatch(addCar(data.car));
          alert("Voiture ajoutée !");
        } else {
          alert(data.error);
        }
      });
  };

  // préparation de l'affichage des photos
  const photos = user.photos?.map((data, i) => {
    // on boucle sur les photos de l'utilisateur pour les afficher, 'data' est l'URL de la photo
    return (
      <View key={i} style={styles.photoContainer}>
        <TouchableOpacity
          onPress={() => deletePicture(data)}
          accessibilityRole="button"
          accessibilityLabel="Supprimer la photo"
        >
          <FontAwesome
            name="times"
            size={22}
            color="#000000"
            style={styles.deleteIcon}
          />
        </TouchableOpacity>

        <Image source={{ uri: data }} style={styles.photo} />
      </View>
    );
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Modal visible={activeModal === "camera"} animationType="slide">
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              ref={cameraRef} // on attache la ref à la caméra pour pouvoir l'utiliser dans takePicture
              facing={facing} // caméra avant ou arrière selon le state
              flash={flash}
            />

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Fermer la caméra"
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
                accessibilityRole="button"
                accessibilityLabel="Activer ou désactiver le flash"
                style={styles.flashButton}
                onPress={toggleFlash}
              >
                <FontAwesome name="flash" size={30} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Prendre une photo"
                style={{ alignItems: "center" }}
                onPress={async () => {
                  console.log("bouton appuyé");
                  await takePicture(); // on attend que la photo soit prise
                  console.log("photo prise");

                  closeModal();
                }}
              >
                <FontAwesome name="circle-thin" size={90} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Changer de caméra"
                style={styles.rotateButton}
                onPress={toggleCameraFacing}
              >
                <FontAwesome name="rotate-right" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={activeModal === "car"}
          animationType="fade"
          transparent={true}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Fermer le formulaire d'ajout de voiture"
                  onPress={closeModal}
                  style={{ alignSelf: "flex-end" }}
                >
                  <FontAwesomeIcon icon={faXmark} size={30} color="#A7333F" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Ma Voiture</Text>

                <TextInput
                  placeholderTextColor="#aaa"
                  accessibilityLabel="Ajouter la marque "
                  placeholder="Marque"
                  style={styles.input}
                  onChangeText={setBrand}
                  value={brand}
                />
                <TextInput
                  placeholderTextColor="#aaa"
                  accessibilityLabel="Ajouter le modèle"
                  placeholder="Modèle"
                  style={styles.input}
                  onChangeText={setModel}
                  value={model}
                />
                <TextInput
                  placeholderTextColor="#aaa"
                  accessibilityLabel="Ajouter la couleur"
                  placeholder="Couleur"
                  style={styles.input}
                  onChangeText={setColor}
                  value={color}
                />
                <TextInput
                  placeholderTextColor="#aaa"
                  accessibilityLabel="Ajouter le nombre de places"
                  placeholder="Nombre de places"
                  style={styles.input}
                  onChangeText={setNbSeats}
                  value={nbSeats}
                />
                <TextInput
                  placeholderTextColor="#aaa"
                  accessibilityLabel="Ajouter la plaque d'immatriculation"
                  placeholder="Plaque d'immatriculation"
                  style={styles.input}
                  onChangeText={setLicencePlate}
                  value={licencePlate}
                />

                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Enregistrer les informations de ma voiture"
                  style={styles.registerBtn}
                  onPress={() => {
                    (newCar(), closeModal());
                  }}
                >
                  <Text style={styles.textBtn}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <Arrow />

        <ScrollView contentContainerStyle={{ top: 60 }}>
          <View style={styles.header}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: "#A7333F",
                textAlign: "center",
              }}
            >
              Mon espace Conducteur
            </Text>
            <Text style={{ fontSize: 15, color: "#888", margin: 15 }}>
              Complétez votre profil pour proposer des trajets
            </Text>
          </View>
          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>Mon permis de conduire</Text>
            <Text style={styles.blocDesc}>
              Prenez une photo de votre permis
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                // le label change selon que l'utilisateur a déjà une photo ou pas
                hasPhoto
                  ? "Modifier la photo de mon permis de conduire"
                  : "Ajouter une photo de mon permis de conduire"
              }
              style={[styles.btn, hasPhoto && styles.btnDone]} // si l'utilisateur a déjà une photo, on applique un style différent pour indiquer que c'est bon
              onPress={() => openModal("camera")}
            >
              <Text style={styles.btnText}>
                {hasPhoto ? "✓ Document ajouté" : "Prendre une photo"}
              </Text>
            </TouchableOpacity>
            {/* le texte du bouton change aussi selon la situation */}

            {/* si l'utilisateur a une photo, on l'affiche en dessous du bouton */}
            {hasPhoto && <View style={styles.photoContainer}>{photos}</View>}
          </View>

          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>Ma voiture</Text>
            <Text style={styles.blocDesc}>
              Ajoutez les infos de votre véhicule
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                // le label change selon que l'utilisateur a déjà une voiture ou pas
                hasCar
                  ? "Modifier les informations de ma voiture"
                  : "Ajouter les informations de ma voiture"
              }
              style={[styles.btn, hasCar && styles.btnDone]}
              onPress={() => openModal("car")}
            >
              <Text style={styles.btnText}>
                {hasCar // le texte du bouton change selon que l'utilisateur a déjà une voiture ou pas. S'il en a une, on affiche la marque et le modèle pour confirmer que c'est bien enregistré
                  ? `✓ ${user.car.brand} ${user.car.model}`
                  : "Ajouter ma voiture"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bloc}>
            <Text style={styles.blocTitle}>Proposer un trajet</Text>
            <Text style={styles.blocDesc}>
              {hasPhoto && hasCar // si l'utilisateur a une photo et une voiture, on affiche un message de confirmation, sinon on invite à compléter les étapes précédentes
                ? "Vous êtes prêt à proposer un trajet !"
                : "Complétez les étapes ci-dessus d'abord"}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                // le label change selon que l'utilisateur a déjà une photo et une voiture ou pas
                hasPhoto && hasCar
                  ? "Proposer un nouveau trajet"
                  : "Complétez votre profil pour proposer un trajet"
              }
              style={[styles.btn, !(hasPhoto && hasCar) && styles.btnDisabled]} // si l'utilisateur n'a pas de photo ou de voiture, on désactive le bouton et on change son style pour indiquer que c'est bloqué
              disabled={!(hasPhoto && hasCar)} // le bouton est désactivé tant que l'utilisateur n'a pas de photo et de voiture
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
    backgroundColor: "#26496c",
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
    width: "90%",
    borderBottomColor: "#A7333F",
    borderBottomWidth: 0.5,
    fontSize: 16,
    paddingVertical: 8,
    color: "#1a1a1a",
    marginBottom: 8,
  },
  textBtn: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  registerBtn: {
    backgroundColor: "#A7333F",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
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
    color: "#A7333F",
    marginBottom: 8,
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

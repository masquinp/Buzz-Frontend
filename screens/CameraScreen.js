import React, { useEffect, useState, useRef } from "react";
import { CameraView, Camera } from "expo-camera";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/users";
import Arrow from "../components/Arrow";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SnapScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result?.status === "granted");
    })();
  }, []);

  if (!hasPermission || !isFocused) {
    return <View style={{ flex: 1 }} />;
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });

      if (photo?.uri) {
        console.log("Photo capturée :", photo.uri);
        dispatch(addPhoto(photo.uri));
      }
    } catch (error) {
      console.log("Erreur lors de la prise de photo :", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        flash={flash}
      />

      <Arrow color="#fff" top={70}/>

      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <FontAwesome name="circle-thin" size={90} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <FontAwesome name="flash" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rotateButton} onPress={toggleCameraFacing}>
        <FontAwesome name="rotate-right" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  flashButton: {
    position: "absolute",
    top: 70,
    right: 20,
  },
  rotateButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
import React, { useEffect, useState, useRef } from "react";
import { CameraView, Camera } from "expo-camera";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/user";

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
    return <View />;
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
    <SafeAreaView>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          ref={cameraRef}
          facing={facing}
          flash={flash}
        />
        <Arrow />
        <TouchableOpacity onPress={takePicture}>
          <FontAwesome name="circle-thin" size={80} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFlash}>
          <FontAwesome name="flash" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCameraFacing}>
          <FontAwesome name="rotate-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

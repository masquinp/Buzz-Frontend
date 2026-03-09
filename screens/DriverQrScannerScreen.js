import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function DriverQrScannerScreen({ navigation, route }) {
  const tripId = route?.params?.tripId || "trip_123";

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastValue, setLastValue] = useState("");

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setLastValue(data);

    // On renvoie juste le bookingId scanné à DriverTripDetailsScreen
    navigation.navigate("DriverTripDetails", {
      tripId,
      scannedBookingId: data,
    });
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.infoText}>Chargement de la caméra...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.title}>Autorisation caméra requise</Text>
        <Text style={styles.infoText}>
          Le conducteur doit autoriser l’accès à la caméra pour scanner le QR code du passager.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
        >
          <Text style={styles.primaryButtonText}>Autoriser la caméra</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Scanner un passager</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Camera */}
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.scanBox} />
          </View>
        </View>

        {/* Footer infos */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Scan du QR passager</Text>
          <Text style={styles.footerText}>
            Le QR doit contenir uniquement le bookingId du passager.
          </Text>

          {lastValue ? (
            <Text style={styles.lastValueText}>
              Dernier QR lu : {lastValue}
            </Text>
          ) : null}

          {scanned && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.primaryButtonText}>Scanner à nouveau</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  centeredContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },

  header: {
    height: 56,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 24,
    color: "#fff",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  headerRightPlaceholder: {
    width: 40,
  },

  cameraWrapper: {
    flex: 1,
    position: "relative",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 240,
    height: 240,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  footer: {
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },

  footerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  footerText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },

  lastValueText: {
    color: "#2dd4bf",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  infoText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },

  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  secondaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
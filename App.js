import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [numberOfDetected, setNumberOfDetected] = useState(0)
  const scannedRef = useRef(scanned);
  scannedRef.current = scanned;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data, bounds, cornerPoints }) => {
    // setScanned(true);
    // setIsScanning(false);

    // alert removed, to not press ok each time
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(`type: ${type}, data: ${data}`)
    setNumberOfDetected(number => number + 1)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const scan = () => {
    setIsScanning(true);
    // setScanned(false);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <Background />
      </BarCodeScanner>
      <View style={styles.buttonsContainer}>
        {!isScanning && (
          <Button
            title="Start infinite scanning"
            onPress={scan}
          />
        )}
        {isScanning && (
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            Scanning...
          </Text>
        )}
        {isScanning && (
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>{`Number of detected QR's: ${numberOfDetected}`}</Text>
        )}
      </View>
    </View>
  );
}

const Background = () => {
  return (
    <>
      <View style={styles.layerTop} />
      <View style={styles.layerCenter}>
        <View style={styles.layerLeft} />
        <View style={styles.focused} />
        <View style={styles.layerRight} />
      </View>
      <View style={styles.layerBottom} />
    </>
  );
};

const opacity = "rgba(0, 0, 0, .4)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1.2,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 0.8,
    backgroundColor: opacity,
  },
  focused: {
    flex: 3,
  },
  layerRight: {
    flex: 0.8,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },
  buttonsContainer: {
    height: 120,
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

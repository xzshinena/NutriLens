/**
 * Scan screen for barcode scanning
 */
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import OwlMascot from '../src/components/OwlMascot';
import { useScanner } from '../src/hooks/useScanner';
import { colors } from '../src/lib/colors';
import { typography } from '../src/lib/typography';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = 250;

const ScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const { 
    hasPermission, 
    scanned, 
    isScanning, 
    startScanning, 
    stopScanning, 
    handleBarCodeScanned 
  } = useScanner();

  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (hasPermission === false) {
      Alert.alert(
        'Camera Permission Required',
        'NutriLens needs camera access to scan barcodes. Please enable camera permissions in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => {/* Could open settings here */} }
        ]
      );
    }
  }, [hasPermission]);

  const handleStartScan = () => {
    if (hasPermission === false) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera permissions to scan barcodes.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setShowScanner(true);
    startScanning();
  };

  const handleStopScan = () => {
    setShowScanner(false);
    stopScanning();
  };

  const handleBarCodeScannedWrapper = ({ data }: { data: string }) => {
    const product = handleBarCodeScanned(data);
    if (product) {
      // Navigate to home screen with the scanned product
      (navigation as any).navigate('Home', { product });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="camera" size={64} color={colors.text.secondary} />
          <Text style={styles.permissionText}>
            Camera permission is required to scan barcodes
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={() => {/* Could request permission again */}}
          >
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showScanner && isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScannedWrapper}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "code128", "code39", "codabar", "upc_e", "upc_a"],
          }}
          style={styles.scanner}
        />
        
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={[styles.overlaySection, styles.topOverlay]} />
          
          {/* Middle section with scan area */}
          <View style={styles.middleSection}>
            <View style={[styles.overlaySection, styles.sideOverlay]} />
            <View style={styles.scanArea}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanInstruction}>
                Point me at the barcode!
              </Text>
            </View>
            <View style={[styles.overlaySection, styles.sideOverlay]} />
          </View>
          
          {/* Bottom overlay */}
          <View style={[styles.overlaySection, styles.bottomOverlay]} />
        </View>
        
        {/* Close button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleStopScan}
        >
          <Ionicons name="close" size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <OwlMascot 
          mood="happy" 
          message="Point me at a barcode to see if it's safe for you!" 
        />
        
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={handleStartScan}
        >
          <Ionicons name="camera" size={24} color={colors.text.inverse} />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
        
        <Text style={styles.instructionText}>
          Make sure the barcode is well-lit and clearly visible
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  topOverlay: {
    flex: 1,
  },
  middleSection: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  sideOverlay: {
    flex: 1,
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: SCAN_AREA_SIZE - 40,
    height: SCAN_AREA_SIZE - 40,
    borderWidth: 3,
    borderColor: colors.accentBlue,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scanInstruction: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bottomOverlay: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
    minHeight: 48,
  },
  scanButtonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: 8,
  },
  instructionText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
  },
  permissionText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  permissionButton: {
    backgroundColor: colors.accentBlue,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  permissionButtonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
});

export default ScanScreen;

/**
 * Hook for managing barcode scanner functionality
 */
import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { barcodeToProduct } from '../lib/mockData';
import { Product } from '../types';

interface UseScannerReturn {
  hasPermission: boolean | null;
  scanned: boolean;
  isScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
  handleBarCodeScanned: (data: string) => Product | null;
}

export const useScanner = (): UseScannerReturn => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Request camera permission on mount
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleBarCodeScanned = (data: string): Product | null => {
    if (scanned) return null;
    
    setScanned(true);
    setIsScanning(false);

    // Look up product by barcode
    const product = barcodeToProduct[data];
    
    if (!product) {
      Alert.alert(
        'Product Not Found',
        'We couldn\'t find this product in our database. Try scanning a different barcode or search for it manually.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
      return null;
    }

    return product;
  };

  return {
    hasPermission,
    scanned,
    isScanning,
    startScanning,
    stopScanning,
    handleBarCodeScanned,
  };
};

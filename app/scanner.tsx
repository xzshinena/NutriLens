import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ⚠️ Replace with your actual keys
const NUTRITIONIX_APP_ID = "YOUR_APP_ID";
const NUTRITIONIX_API_KEY = "YOUR_API_KEY";
const USDA_API_KEY = "YOUR_USDA_KEY";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);

  if (!permission) {
    return <Text>Requesting permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const fetchProductData = async (code: string) => {
    setLoading(true);
    setProduct(null);
    setSource(null);

    // 1. Try OpenFoodFacts
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();
      if (json.status === 1) {
        setSource("OpenFoodFacts");
        setProduct(json.product);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("OpenFoodFacts error:", e);
    }

    // 2. Try Nutritionix
    try {
      const res = await fetch(
        `https://trackapi.nutritionix.com/v2/search/item?upc=${code}`,
        {
          headers: {
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_API_KEY,
          },
        }
      );
      const json = await res.json();
      if (json.foods && json.foods.length > 0) {
        setSource("Nutritionix");
        setProduct(json.foods[0]);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Nutritionix error:", e); 
    }

    // 3. Try USDA
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${code}&api_key=${USDA_API_KEY}`
      );
      const json = await res.json();
      if (json.foods && json.foods.length > 0) {
        setSource("USDA FoodData Central");
        setProduct(json.foods[0]);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("USDA error:", e);
    }

    setLoading(false);
    setProduct(null);
  };

  const getHealthWarnings = (nutriments: any) => {
    const warnings: string[] = [];
    if (!nutriments) return warnings;

    if (nutriments.sugars > 15) warnings.push("⚠️ High Sugar");
    if (nutriments.fat > 20) warnings.push("⚠️ High Fat");
    if (nutriments.salt > 2) warnings.push("⚠️ High Salt");

    return warnings;
  };

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
        }}
        onBarcodeScanned={({ data }) => {
          if (!scanned) {
            setScanned(true);
            setBarcode(data);
            fetchProductData(data);
          }
        }}
      />

      {/* Reset Button */}
      {scanned && (
        <Button
          title="Scan Again"
          onPress={() => {
            setScanned(false);
            setBarcode(null);
            setProduct(null);
            setSource(null);
          }}
        />
      )}

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Product Info */}
      {product && (
        <ScrollView style={styles.infoBox}>
          <Text style={{ fontStyle: "italic" }}>Source: {source}</Text>

          {product.image_url && (
            <Image
              source={{ uri: product.image_url }}
              style={{ width: 120, height: 120, marginBottom: 8 }}
            />
          )}

          <Text style={styles.title}>
            {product.product_name || product.food_name || "Unknown Product"}
          </Text>
          <Text>Brand: {product.brands || product.brand_name || "N/A"}</Text>
          <Text>
            Ingredients: {product.ingredients_text || product.nf_ingredient_statement || "N/A"}
          </Text>
          <Text>
            Energy:{" "}
            {product.nutriments?.energy ||
              product.nf_calories ||
              product.foodNutrients?.[0]?.value ||
              "?"} kcal
          </Text>
          <Text>
            Sugar:{" "}
            {product.nutriments?.sugars ||
              product.nf_sugars ||
              "?"} g
          </Text>
          <Text>
            Fat:{" "}
            {product.nutriments?.fat ||
              product.nf_total_fat ||
              "?"} g
          </Text>
          <Text>
            Salt:{" "}
            {product.nutriments?.salt ||
              product.nf_sodium ||
              "?"} g
          </Text>

          {/* Health warnings */}
          {getHealthWarnings(product.nutriments).map((w, idx) => (
            <Text key={idx} style={{ color: "red", fontWeight: "bold" }}>
              {w}
            </Text>
          ))}
        </ScrollView>
      )}

      {/* No Product Found */}
      {barcode && !product && !loading && (
        <Text style={styles.text}>No product found for code {barcode}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 4,
  },
  infoBox: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    maxHeight: 300,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});

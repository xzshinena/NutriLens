import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DietaryAnalysis } from '../components/DietaryAnalysis';
import { useDietaryPreferences } from '../hooks/useDietaryPreferences';
import { analyzeDietaryCompatibility, explainDietaryRestriction } from '../services/APIcall';
import { DietaryAnalysis as IDietaryAnalysis, ProductNutrition, getAllDietaryProfiles } from '../types/dietary';

// ⚠️ Replace with your actual keys - or better yet, use environment variables
const NUTRITIONIX_APP_ID = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID || "YOUR_APP_ID";
const NUTRITIONIX_API_KEY = process.env.EXPO_PUBLIC_NUTRITIONIX_API_KEY || "YOUnpsR_API_KEY";
const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY || "YOUR_USDA_KEY";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [dietaryAnalysis, setDietaryAnalysis] = useState<IDietaryAnalysis | null>(null);
  const [showDietarySelector, setShowDietarySelector] = useState(false);
  
  // Dietary preferences hook
  const { selectedDiet, selectedProfile, saveDietaryPreference } = useDietaryPreferences();
  
  // Get all dietary profiles for selection
  const allDietaryProfiles = getAllDietaryProfiles();

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
    setDietaryAnalysis(null);

    let fetchedProduct = null;
    let fetchedSource = null;

    // 1. Try OpenFoodFacts
    try {
      console.log(`Fetching from OpenFoodFacts for code: ${code}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.status === 1) {
        fetchedSource = "OpenFoodFacts";
        fetchedProduct = json.product;
        setSource(fetchedSource);
        setProduct(fetchedProduct);
        setLoading(false);
        
        // Trigger dietary analysis if user has selected a diet
        if (selectedProfile) {
          analyzeProductDiet(fetchedProduct, fetchedSource);
        }
        return;
      }
    } catch (e) {
      console.error("OpenFoodFacts error:", e);
      if (e.name === 'AbortError') {
        console.log("OpenFoodFacts request timed out");
      }
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
        fetchedSource = "Nutritionix";
        fetchedProduct = json.foods[0];
        setSource(fetchedSource);
        setProduct(fetchedProduct);
        setLoading(false);
        
        // Trigger dietary analysis if user has selected a diet
        if (selectedProfile) {
          analyzeProductDiet(fetchedProduct, fetchedSource);
        }
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
        fetchedSource = "USDA FoodData Central";
        fetchedProduct = json.foods[0];
        setSource(fetchedSource);
        setProduct(fetchedProduct);
        setLoading(false);
        
        // Trigger dietary analysis if user has selected a diet
        if (selectedProfile) {
          analyzeProductDiet(fetchedProduct, fetchedSource);
        }
        return;
      }
    } catch (e) {
      console.error("USDA error:", e);
    }

    setLoading(false);
    setProduct(null);
  };

  // Convert product data to standardized format for dietary analysis
  const convertToProductNutrition = (productData: any, dataSource: string): ProductNutrition => {
    let nutrition: ProductNutrition = {
      productName: productData.product_name || productData.food_name || productData.description || 'Unknown Product',
      brand: productData.brands || productData.brand_name || undefined,
      ingredients: productData.ingredients_text || productData.nf_ingredient_statement || undefined,
    };

    if (dataSource === 'OpenFoodFacts') {
      nutrition = {
        ...nutrition,
        calories: productData.nutriments?.energy_kcal || productData.nutriments?.energy,
        carbs: productData.nutriments?.carbohydrates,
        sugars: productData.nutriments?.sugars,
        fat: productData.nutriments?.fat,
        saturatedFat: productData.nutriments?.saturated_fat || productData.nutriments?.['saturated-fat'],
        protein: productData.nutriments?.proteins,
        fiber: productData.nutriments?.fiber,
        salt: productData.nutriments?.salt,
        sodium: productData.nutriments?.sodium,
        allergens: productData.allergens_tags || [],
        labels: productData.labels_tags || [],
        nutriScore: productData.nutrition_grades,
        novaGroup: productData.nova_groups,
      };
    } else if (dataSource === 'Nutritionix') {
      nutrition = {
        ...nutrition,
        calories: productData.nf_calories,
        carbs: productData.nf_total_carbohydrate,
        sugars: productData.nf_sugars,
        fat: productData.nf_total_fat,
        saturatedFat: productData.nf_saturated_fat,
        protein: productData.nf_protein,
        fiber: productData.nf_dietary_fiber,
        sodium: productData.nf_sodium,
      };
    } else if (dataSource === 'USDA FoodData Central') {
      // USDA format is more complex, would need to parse foodNutrients array
      const nutrients = productData.foodNutrients || [];
      nutrition = {
        ...nutrition,
        calories: nutrients.find((n: any) => n.nutrientName?.includes('Energy'))?.value,
        // Add other nutrient mappings as needed
      };
    }

    return nutrition;
  };

  // Analyze product for dietary compatibility
  const analyzeProductDiet = async (productData: any, dataSource: string) => {
    if (!selectedProfile) return;
    
    // Prevent duplicate calls
    if (analysisLoading) {
      console.log('Analysis already in progress, skipping duplicate call');
      return;
    }

    setAnalysisLoading(true);
    console.log(`Starting AI analysis for ${selectedProfile.name} diet...`);
    const startTime = Date.now();
    
    try {
      const nutrition = convertToProductNutrition(productData, dataSource);
      console.log('Product nutrition data prepared:', nutrition);
      
      console.log('Calling Gemini API...');
      const analysis = await analyzeDietaryCompatibility(nutrition, selectedProfile);
      
      const endTime = Date.now();
      console.log(`AI analysis completed in ${endTime - startTime}ms`);
      setDietaryAnalysis(analysis);
    } catch (error) {
      const endTime = Date.now();
      console.error(`Error analyzing dietary compatibility (${endTime - startTime}ms):`, error);
      
      Alert.alert(
        'Analysis Error', 
        `Could not analyze this product for your dietary restriction.\n\nError: ${error.message}\n\nTime: ${endTime - startTime}ms`
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Explain dietary restriction
  const handleExplainDiet = async () => {
    if (!selectedProfile) return;

    try {
      const explanation = await explainDietaryRestriction(selectedProfile);
      Alert.alert(
        `About ${selectedProfile.name}`,
        explanation,
        [{ text: 'Got it', style: 'default' }],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert(
        `About ${selectedProfile.name}`,
        selectedProfile.description,
        [{ text: 'Got it', style: 'default' }]
      );
    }
  };

  const getHealthWarnings = (nutriments: any) => {
    const warnings: string[] = [];
    if (!nutriments) return warnings;

    if (nutriments.sugars > 15) warnings.push("⚠️ High Sugar");
    if (nutriments.fat > 20) warnings.push("⚠️ High Fat");
    if (nutriments.salt > 2) warnings.push("⚠️ High Salt");

    return warnings;
  };

  const resetScan = () => {
    setScanned(false);
    setBarcode(null);
    setProduct(null);
    setSource(null);
    setDietaryAnalysis(null);
  };

  const handleDietarySelect = async (dietId: string | null) => {
    try {
      await saveDietaryPreference(dietId);
      setShowDietarySelector(false);
    } catch (error) {
      console.error('Error saving dietary preference:', error);
      Alert.alert('Error', 'Could not save dietary preference. Please try again.');
    }
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

      {/* Dietary Restriction Selector */}
      <View style={styles.topOverlay}>
        <TouchableOpacity 
          style={styles.dietaryButton}
          onPress={() => setShowDietarySelector(!showDietarySelector)}
        >
          <Text style={styles.dietaryButtonText}>
            {selectedProfile ? `${selectedProfile.emoji} ${selectedProfile.name}` : '🍽️ Select Diet'}
          </Text>
          <Ionicons name={showDietarySelector ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
        </TouchableOpacity>

        {showDietarySelector && (
          <View style={styles.dietaryDropdown}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.dietaryList}>
              {allDietaryProfiles.map((diet) => (
                <TouchableOpacity
                  key={diet.id}
                  style={[
                    styles.dietaryItem,
                    selectedDiet === diet.id && styles.dietaryItemSelected
                  ]}
                  onPress={() => handleDietarySelect(diet.id)}
                >
                  <Text style={styles.dietaryEmoji}>{diet.emoji}</Text>
                  <View style={styles.dietaryInfo}>
                    <Text style={styles.dietaryName}>{diet.name}</Text>
                    <Text style={styles.dietaryDescription}>{diet.description}</Text>
                  </View>
                  {selectedDiet === diet.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
              
              {selectedDiet && (
                <TouchableOpacity
                  style={styles.dietaryClearButton}
                  onPress={() => handleDietarySelect(null)}
                >
                  <Ionicons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.dietaryClearText}>Clear Selection</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Scan overlay frame */}
      {!scanned && (
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Text style={styles.scanInstructions}>
              {selectedProfile ? `Scanning for ${selectedProfile.name}` : 'Point camera at barcode'}
            </Text>
          </View>
        </View>
      )}

      {/* Reset Button */}
      {scanned && (
        <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
          <Text style={styles.resetButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Fetching product data...</Text>
        </View>
      )}

      {/* Product Info */}
      {product && (
        <ScrollView style={styles.infoBox} showsVerticalScrollIndicator={false}>
          <View style={styles.productHeader}>
            <Text style={styles.sourceText}>📡 Source: {source}</Text>
            
            {product.image_url && (
              <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
              />
            )}

            <Text style={styles.title}>
              {product.product_name || product.food_name || "Unknown Product"}
            </Text>
            <Text style={styles.brandText}>Brand: {product.brands || product.brand_name || "N/A"}</Text>
          </View>

          {/* Nutrition Facts */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Energy</Text>
                <Text style={styles.nutritionValue}>
                  {product.nutriments?.energy_kcal ||
                    product.nutriments?.energy ||
                    product.nf_calories ||
                    product.foodNutrients?.[0]?.value ||
                    "?"}
                </Text>
                <Text style={styles.nutritionUnit}>kcal</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Sugar</Text>
                <Text style={styles.nutritionValue}>
                  {product.nutriments?.sugars ||
                    product.nf_sugars ||
                    "?"}
                </Text>
                <Text style={styles.nutritionUnit}>g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>
                  {product.nutriments?.fat ||
                    product.nf_total_fat ||
                    "?"}
                </Text>
                <Text style={styles.nutritionUnit}>g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Salt</Text>
                <Text style={styles.nutritionValue}>
                  {product.nutriments?.salt ||
                    product.nf_sodium ||
                    "?"}
                </Text>
                <Text style={styles.nutritionUnit}>g</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          {(product.ingredients_text || product.nf_ingredient_statement) && (
            <View style={styles.ingredientsSection}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>
                {product.ingredients_text || product.nf_ingredient_statement}
              </Text>
            </View>
          )}

          {/* Basic Health warnings */}
          {getHealthWarnings(product.nutriments).length > 0 && (
            <View style={styles.warningsSection}>
              <Text style={styles.sectionTitle}>Health Warnings</Text>
              {getHealthWarnings(product.nutriments).map((w, idx) => (
                <Text key={idx} style={styles.warningText}>
                  {w}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* AI Dietary Analysis */}
      {analysisLoading && (
        <View style={styles.analysisLoadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>🤖 AI analyzing for {selectedProfile?.name}...</Text>
        </View>
      )}

      {dietaryAnalysis && selectedProfile && (
        <DietaryAnalysis 
          analysis={dietaryAnalysis}
          dietaryRestriction={selectedProfile}
          productName={product?.product_name || product?.food_name || 'Unknown Product'}
          onExplainMore={handleExplainDiet}
        />
      )}

      {/* No Product Found */}
      {barcode && !product && !loading && (
        <View style={styles.errorOverlay}>
          <Ionicons name="search-outline" size={48} color="#666" />
          <Text style={styles.errorText}>No product found for code {barcode}</Text>
          <Text style={styles.errorSubtext}>
            Try scanning another barcode or check the lighting
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#000'
  },
  topOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  dietaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
  },
  dietaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  dietaryDropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    maxHeight: 300,
    overflow: 'hidden',
  },
  dietaryList: {
    maxHeight: 280,
  },
  dietaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dietaryItemSelected: {
    backgroundColor: '#E8F5E8',
  },
  dietaryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  dietaryInfo: {
    flex: 1,
  },
  dietaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dietaryDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  dietaryClearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dietaryClearText: {
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 8,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  scanFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanInstructions: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resetButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  analysisLoadingOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 15,
  },
  loadingText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 15,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  infoBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '60%',
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    paddingTop: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  productHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  nutritionSection: {
    marginBottom: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  ingredientsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  warningsSection: {
    marginBottom: 20,
  },
  warningText: {
    color: "#F44336",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});

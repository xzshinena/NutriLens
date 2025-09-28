/**
 * Dietary Analysis Display Component
 * Shows AI-powered dietary compatibility analysis results
 */

import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DietaryRestriction, DietaryAnalysis as IDietaryAnalysis } from '../../lib/dietary';
import { analyzeIngredientRisks } from '../../services/APIcalls';

interface DietaryAnalysisProps {
  analysis: IDietaryAnalysis;
  dietaryRestriction: DietaryRestriction;
  productName: string;
  productIngredients?: string;
  onExplainMore?: () => void;
}

interface IngredientRisk {
  name: string;
  category: string;
  riskLevel: 'high' | 'moderate' | 'low';
  reason: string;
}

export const DietaryAnalysis: React.FC<DietaryAnalysisProps> = (props) => {
  const { analysis, dietaryRestriction, productName, productIngredients, onExplainMore } = props;
  const [showIngredients, setShowIngredients] = useState(false);
  const [showFullReportModal, setShowFullReportModal] = useState(false);
  const [ingredientRisks, setIngredientRisks] = useState<IngredientRisk[]>([]);
  const [analyzingIngredients, setAnalyzingIngredients] = useState(false);

  const getCompatibilityColor = () => {
    if (analysis.isCompatible) return '#4CAF50';
    return analysis.riskLevel === 'high' ? '#F44336' : '#FF9800';
  };

  const getCompatibilityIcon = () => {
    if (analysis.isCompatible) return 'checkmark-circle';
    return analysis.riskLevel === 'high' ? 'warning' : 'alert-circle';
  };


  const showFullAnalysis = () => {
    setShowFullReportModal(true);
  };

  const getFullAnalysisText = () => {
    return `DIETARY ANALYSIS REPORT

Product: ${productName}
Diet: ${dietaryRestriction.name}

COMPATIBILITY: ${analysis.isCompatible ? 'YES' : 'NO'}
RISK LEVEL: ${analysis.riskLevel.toUpperCase()}
SCORE: ${analysis.compatibilityScore}/100

REASONS:
${analysis.reasons.map((reason: string) => `• ${reason}`).join('\n')}

${analysis.warnings.length > 0 ? `
WARNINGS:
${analysis.warnings.map((warning: string) => `• ${warning}`).join('\n')}
` : ''}

${analysis.recommendations.length > 0 ? `
RECOMMENDATIONS:
${analysis.recommendations.map((rec: string) => `• ${rec}`).join('\n')}
` : ''}

${analysis.alternatives && analysis.alternatives.length > 0 ? `
ALTERNATIVES:
${analysis.alternatives.map((alt: string) => `• ${alt}`).join('\n')}
` : ''}

${analysis.nutrientConcerns && analysis.nutrientConcerns.length > 0 ? `
NUTRIENT CONCERNS:
${analysis.nutrientConcerns.map((concern: any) => 
  `${concern.severity === 'critical' ? 'CRITICAL' : concern.severity === 'warning' ? 'WARNING' : 'INFO'} ${concern.nutrient}: ${concern.value} (limit: ${concern.limit})`
).join('\n')}
` : ''}

Analysis powered by Google Gemini AI`;
  };

  const toggleIngredientsList = async () => {
    setShowIngredients(!showIngredients);
    
    if (!showIngredients && productIngredients && ingredientRisks.length === 0) {
      setAnalyzingIngredients(true);
      
      try {
        const risks = await analyzeIngredientRisks(productIngredients, dietaryRestriction);
        setIngredientRisks(risks);
      } catch (error) {
        console.error('Error analyzing ingredient risks:', error);
        // Fallback to basic analysis
        const basicRisks = analyzeIngredientsBasic(productIngredients);
        setIngredientRisks(basicRisks);
      } finally {
        setAnalyzingIngredients(false);
      }
    }
  };

  const analyzeIngredientsBasic = (ingredients: string): IngredientRisk[] => {
    const ingredientsList = ingredients.split(/[,;]/).map(ingredient => ingredient.trim());
    const avoidIngredients = dietaryRestriction.avoidIngredients.map(ing => ing.toLowerCase());

    return ingredientsList.map(ingredient => {
      const isHarmful = avoidIngredients.some(avoid => 
        ingredient.toLowerCase().includes(avoid) || avoid.includes(ingredient.toLowerCase())
      );

      return {
        name: ingredient,
        category: 'Ingredient',
        riskLevel: isHarmful ? 'high' as const : 'low' as const,
        reason: isHarmful ? `May contain ${dietaryRestriction.name}-restricted ingredients` : 'Appears safe'
      };
    });
  };

  const getRiskColor = (riskLevel: 'high' | 'moderate' | 'low') => {
    switch (riskLevel) {
      case 'high': return '#F44336';
      case 'moderate': return '#FF9800';
      case 'low': return '#4CAF50';
    }
  };

  const getRiskText = (riskLevel: 'high' | 'moderate' | 'low') => {
    switch (riskLevel) {
      case 'high': return 'High-risk';
      case 'moderate': return 'Moderate risk';
      case 'low': return 'Risk-free';
    }
  };

  const renderInlineIngredients = () => {
    if (!showIngredients) {
      return null;
    }

    if (!productIngredients) {
      return (
        <View style={styles.ingredientsSection}>
          <Text style={styles.ingredientsSectionTitle}>Ingredients</Text>
          <Text style={styles.emptyStateText}>Ingredients information not available for this product.</Text>
        </View>
      );
    }

    if (analyzingIngredients) {
      return (
        <View style={styles.ingredientsSection}>
          <Text style={styles.ingredientsSectionTitle}>Ingredients</Text>
          <Text style={styles.loadingText}>Analyzing ingredients for {dietaryRestriction.name} diet...</Text>
        </View>
      );
    }

    if (ingredientRisks.length === 0) {
      return null;
    }

    // Sort ingredients by risk level (high first)
    const sortedRisks = [...ingredientRisks].sort((a, b) => {
      const riskOrder = { 'high': 0, 'moderate': 1, 'low': 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });

    return (
      <View style={styles.ingredientsSection}>
        <Text style={styles.ingredientsSectionTitle}>Ingredients</Text>
        {sortedRisks.map((ingredient, index) => (
          <View key={index} style={styles.inlineIngredientItem}>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
            </View>
            <View style={styles.riskContainer}>
              <Text style={[styles.riskText, { color: getRiskColor(ingredient.riskLevel) }]}>
                {getRiskText(ingredient.riskLevel)}
              </Text>
              <View style={[styles.riskDot, { backgroundColor: getRiskColor(ingredient.riskLevel) }]} />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View>
      {/* Clean Analysis Content - No redundant headers */}
      {/* Main Reasons */}
      <View style={styles.cleanReasonsContainer}>
        {analysis.reasons.length > 0 && (
          <>
            <Text style={styles.cleanSectionTitle}>Analysis</Text>
            {analysis.reasons.slice(0, 3).map((reason: any, index: any) => (
              <Text key={index} style={styles.cleanReasonText}>• {reason}</Text>
            ))}
          </>
        )}
      </View>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <View style={styles.warningsContainer}>
          <Text style={styles.warningsTitle}>⚠️ Warnings</Text>
          {analysis.warnings.slice(0, 2).map((warning: any, index: any) => (
            <Text key={index} style={styles.warningText}>• {warning}</Text>
          ))}
        </View>
      )}

      {/* Product Alternatives */}
      {analysis.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Alternative Products</Text>
          {analysis.recommendations.slice(0, 2).map((recommendation: any, index: any) => (
            <Text key={index} style={styles.recommendationText}>• {recommendation}</Text>
          ))}
        </View>
      )}

      {/* Nutrient Concerns */}
      {analysis.nutrientConcerns && analysis.nutrientConcerns.length > 0 && (
        <View>
          <Text>Nutrient Analysis</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {analysis.nutrientConcerns.map((concern: { nutrient: any; value: any; limit: any; }, index: any) => (
              <View key={index}>
                <Text>{concern.nutrient}</Text>
                <Text>{concern.value}</Text>
                <Text>Limit: {concern.limit}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Parent Communication Buttons */}
      <View style={styles.parentSection}>
        <Text style={styles.parentSectionTitle}>Parent Communication</Text>
        <View style={styles.parentButtons}>
          <TouchableOpacity style={styles.parentButton} onPress={() => {}}>
            <Text style={styles.parentButtonText}>📞 Tell Mom</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.parentButton} onPress={() => {}}>
            <Text style={styles.parentButtonText}>❓ Ask Mom</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={showFullAnalysis}>
          <Text></Text>
          <Text style={styles.actionButtonText}>Full Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={toggleIngredientsList}>
          <Text></Text>
          <Text style={styles.actionButtonText}>{showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}</Text>
        </TouchableOpacity>
      </View>

      {/* Inline Ingredients Section */}
      {renderInlineIngredients()}

      {/* AI Credit */}
      <View style={styles.aiCredit}>
        <Text></Text>
        <Text style={styles.aiCreditText}>Analysis by Google Gemini AI</Text>
      </View>

      {/* Full Report Modal */}
      <Modal
        visible={showFullReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFullReportModal(false)}
      >
        <View style={styles.reportModalContainer}>
          <View style={styles.reportModalHeader}>
            <Text style={styles.reportModalTitle}>Full Analysis Report</Text>
            <TouchableOpacity 
              style={styles.reportCloseButton}
              onPress={() => setShowFullReportModal(false)}
            >
              <Text style={styles.reportCloseButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.reportModalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.reportText}>{getFullAnalysisText()}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cleanReasonsContainer: {
    marginBottom: 16,
  },
  cleanSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  cleanReasonText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 20,
  },
  warningsContainer: {
    marginBottom: 16,
  },
  warningsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#D97706',
    marginBottom: 4,
    lineHeight: 20,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 4,
    lineHeight: 20,
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  aiCredit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  aiCreditText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F8F9FF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D29',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  ingredientsContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  harmfulIngredient: {
    color: '#F44336',
    fontWeight: '600',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  legendContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1D29',
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Inline Ingredients Styles
  ingredientsSection: {
    marginBottom: 16,
  },
  ingredientsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inlineIngredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  // Full Report Modal Styles
  reportModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  reportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F8F9FF',
  },
  reportModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D29',
  },
  reportCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCloseButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  reportModalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  reportText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    fontFamily: 'monospace',
  },
  // Parent Communication Styles
  parentSection: {
    marginBottom: 20,
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEC68A',
  },
  parentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
    textAlign: 'center',
  },
  parentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  parentButton: {
    flex: 1,
    backgroundColor: '#FED7AA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FB923C',
  },
  parentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A3412',
  },
});
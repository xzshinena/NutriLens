/**
 * Dietary Analysis Display Component
 * Shows AI-powered dietary compatibility analysis results
 */

import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DietaryRestriction, DietaryAnalysis as IDietaryAnalysis } from '../types/dietary';

interface DietaryAnalysisProps {
  analysis: IDietaryAnalysis;
  dietaryRestriction: DietaryRestriction;
  productName: string;
  onExplainMore?: () => void;
}

export const DietaryAnalysis: React.FC<DietaryAnalysisProps> = (props: { analysis: any; dietaryRestriction: any; productName: any; onExplainMore: any; }) => {
  const { analysis, dietaryRestriction, productName, onExplainMore } = props;

  const getCompatibilityColor = () => {
    if (analysis.isCompatible) return '#4CAF50';
    return analysis.riskLevel === 'high' ? '#F44336' : '#FF9800';
  };

  const getCompatibilityIcon = () => {
    if (analysis.isCompatible) return 'checkmark-circle';
    return analysis.riskLevel === 'high' ? 'warning' : 'alert-circle';
  };

  const getRiskColor = () => {
    switch (analysis.riskLevel) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#666';
    }
  };

  const showFullAnalysis = () => {
    const analysisText = `
DIETARY ANALYSIS REPORT

Product: ${productName}
Diet: ${dietaryRestriction.name} ${dietaryRestriction.emoji}

COMPATIBILITY: ${analysis.isCompatible ? 'YES' : 'NO'}
RISK LEVEL: ${analysis.riskLevel.toUpperCase()}
SCORE: ${analysis.compatibilityScore}/100

REASONS:
${analysis.reasons.map((reason: string) => `• ${reason}`).join('\n')}

${analysis.warnings.length > 0 ? `
WARNINGS:
${analysis.warnings.map((warning: string) => `⚠️ ${warning}`).join('\n')}
` : ''}

${analysis.recommendations.length > 0 ? `
RECOMMENDATIONS:
${analysis.recommendations.map((rec: string) => `💡 ${rec}`).join('\n')}
` : ''}

${analysis.alternatives && analysis.alternatives.length > 0 ? `
ALTERNATIVES:
${analysis.alternatives.map((alt: string) => `🔄 ${alt}`).join('\n')}
` : ''}

${analysis.nutrientConcerns.length > 0 ? `
NUTRIENT CONCERNS:
${analysis.nutrientConcerns.map((concern: any) => 
  `${concern.severity === 'critical' ? '🔴' : concern.severity === 'warning' ? '🟡' : '🔵'} ${concern.nutrient}: ${concern.value} (limit: ${concern.limit})`
).join('\n')}
` : ''}

Analysis powered by Google Gemini AI
    `;

    Alert.alert(
      'Full Analysis Report',
      analysisText,
      [
        { text: 'Close', style: 'default' },
        { text: 'Share Report', onPress: () => {
          // Could implement sharing functionality here
          console.log('Share report functionality could be added');
        }}
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {/* Header */}
      <View>
        <View>
          <Text>{dietaryRestriction.emoji}</Text>
          <View>
            <Text>{dietaryRestriction.name}</Text>
            <Text>{productName}</Text>
          </View>
        </View>
        <Text>
          {analysis.isCompatible ? '✅' : (analysis.riskLevel === 'high' ? '⚠️' : '❗')}
        </Text>
      </View>

      {/* Compatibility Status */}
      <View>
        <View>
          <Text>
            {analysis.isCompatible ? 'COMPATIBLE' : 'NOT COMPATIBLE'}
          </Text>
          <View>
            <Text>{analysis.compatibilityScore}</Text>
            <Text>/100</Text>
          </View>
        </View>
        
        <View>
          <View />
          <Text>
            {analysis.riskLevel.toUpperCase()} RISK
          </Text>
        </View>
      </View>

      {/* Main Reasons */}
      <View>
        <Text>Analysis Summary</Text>
        {analysis.reasons.slice(0, 2).map((reason: any, index: any) => (
          <View key={index}>
            <Text>ℹ️</Text>
            <Text>{reason}</Text>
          </View>
        ))}
      </View>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <View>
          <Text>⚠️ Warnings</Text>
          {analysis.warnings.slice(0, 2).map((warning: any, index: any) => (
            <View key={index}>
              <Text>⚠️</Text>
              <Text>{warning}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <View>
          <Text>💡 Recommendations</Text>
          {analysis.recommendations.slice(0, 2).map((recommendation: any, index: any) => (
            <View key={index}>
              <Text>💡</Text>
              <Text>{recommendation}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Nutrient Concerns */}
      {analysis.nutrientConcerns.length > 0 && (
        <View>
          <Text>📊 Nutrient Analysis</Text>
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

      {/* Action Buttons */}
      <View>
        <TouchableOpacity onPress={showFullAnalysis}>
          <Text>📄</Text>
          <Text>Full Report</Text>
        </TouchableOpacity>

        {onExplainMore && (
          <TouchableOpacity onPress={onExplainMore}>
            <Text>❓</Text>
            <Text>Explain Diet</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* AI Credit */}
      <View>
        <Text>✨</Text>
        <Text>Analysis by Google Gemini AI</Text>
      </View>
    </View>
  );
};

// Styles will be implemented later
const styles = StyleSheet.create({});
/**
 * Owl mascot component with different moods and speech bubble
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { OwlMood } from '../types';

interface OwlMascotProps {
  mood: OwlMood;
  message: string;
}

const OwlMascot: React.FC<OwlMascotProps> = ({ mood, message }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Bounce animation on mount
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mood]);

  // Get owl icon based on mood
  const getOwlIcon = () => {
    switch (mood) {
      case 'happy':
        return 'happy-outline';
      case 'concerned':
        return 'sad-outline';
      case 'warning':
        return 'warning-outline';
      default:
        return 'help-outline';
    }
  };

  // Get speech bubble color based on mood
  const getBubbleColor = () => {
    switch (mood) {
      case 'happy':
        return colors.primaryGreen;
      case 'concerned':
        return colors.warnYellow;
      case 'warning':
        return colors.alertRed;
      default:
        return colors.accentBlue;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.owlContainer,
          { transform: [{ translateY: bounceAnim }] }
        ]}
      >
        <View style={[styles.speechBubble, { backgroundColor: getBubbleColor() }]}>
          <Text style={styles.speechText}>{message}</Text>
          <View style={[styles.bubbleTail, { borderTopColor: getBubbleColor() }]} />
        </View>
        
        <View style={styles.owlIconContainer}>
          <Ionicons 
            name={getOwlIcon()} 
            size={40} 
            color={colors.accentBlue} 
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  owlContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  speechBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  owlIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default OwlMascot;

/**
 * Empty state component with owl mascot
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import OwlMascot from './OwlMascot';

interface EmptyStateProps {
  title: string;
  message: string;
  mood?: 'happy' | 'concerned' | 'warning';
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  mood = 'happy' 
}) => {
  return (
    <View style={styles.container}>
      <OwlMascot mood={mood} message={message} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
});

export default EmptyState;

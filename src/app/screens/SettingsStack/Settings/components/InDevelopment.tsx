import {Text} from '@/src/app/components';
import AnalyticsManager from '@/src/app/services/AnalyticsManager';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

const Features = [
  {
    emoji: '😇',
    title: 'Transaction Simulation',
    description:
      'Use the recycle bin to remove unnecessary transactions and visualize potential savings, helping you make smarter financial choices.',
  },
  {
    emoji: '🥸',
    title: 'Multiple Budgets',
    description:
      'Manage multiple budgets within the app, perfect for organizing finances across different goals or expenses.',
  },
  {
    emoji: '🫣',
    title: 'Limit Categories',
    description:
      'Set spending limits for specific categories, ensuring you stay within your budget for each area of your spending.',
  },
  {
    emoji: '😎',
    title: 'Reserved Category',
    description:
      'Transfer money from a reserved fund to other categories as needed, allowing flexible budget adjustments.',
  },
  {
    emoji: '😳',
    title: 'Account Types',
    description:
      'Organize your finances more effectively by categorizing different accounts, like checking, savings, or credit, within the app.',
  },
  {
    emoji: '🤯',
    title: 'Goals Section',
    description:
      'Set and track financial goals, helping you stay focused on saving targets and progress toward your financial objectives.',
  },
];

export default () => {
  useEffect(() => {
    AnalyticsManager.remoteLog('SubScreen', {
      name: 'Features in development',
    });
  }, []);
  return (
    <ScrollView
      fadingEdgeLength={100}
      contentContainerStyle={{gap: SPACING.md}}>
      {Features.map(feature => {
        return (
          <View key={feature.title} style={styles.featureItem}>
            <Text style={styles.title}>
              {feature.emoji} {feature.title}
            </Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>
        );
      })}
      <Text style={styles.builtByTextStyle}>Built by Yash & Vaibhav 💜</Text>
      <Text style={styles.builtByTextStyle}>Tested by Savio</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  featureItem: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginHorizontal: SPACING.sm,
  },
  title: {
    fontSize: 16,
    marginBottom: SPACING.md,
    color: COLORS.darkPrimary,
    fontFamily: FONTS.bold,
  },
  description: {
    color: COLORS.mediumGray,
    lineHeight: 18,
    fontSize: 13,
  },
  builtByTextStyle: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: COLORS.darkGray,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
});

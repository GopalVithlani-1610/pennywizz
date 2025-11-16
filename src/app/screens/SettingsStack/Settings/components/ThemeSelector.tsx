import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Pressable, Screen, Text} from '@/app/components';
import {COLORS, SPACING} from '@/app/theme';
import CommonStyles from '@/src/app/styles';
import {useTheme} from '@/app/hooks/useTheme';
import {ThemeMode} from '@/app/state/utils.state';

export default () => {
  const {themeMode, setThemeMode, colors, isDark} = useTheme();

  const themeOptions: {label: string; value: ThemeMode; description: string}[] =
    [
      {
        label: 'Light',
        value: 'light',
        description: 'Always use light theme',
      },
      {
        label: 'Dark',
        value: 'dark',
        description: 'Always use dark theme',
      },
      {
        label: 'System',
        value: 'system',
        description: 'Follow system settings',
      },
    ];

  const handleThemeSelect = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const renderItem = (item: {label: string; value: ThemeMode; description: string}) => {
    const isSelected = item.value === themeMode;
    return (
      <Pressable
        animated={false}
        ripple={CommonStyles.btnRipple}
        onPress={() => handleThemeSelect(item.value)}
        style={[
          styles.itemContainer,
          {
            backgroundColor: isSelected
              ? (isDark ? 'rgba(53, 37, 147, 0.2)' : COLORS.lightPrimary)
              : 'transparent',
          },
        ]}>
        <View style={styles.textContainer}>
          <Text
            textType="normal"
            style={[
              styles.text,
              {
                color: isDark ? colors.text.heading : COLORS.black,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}>
            {item.label}
          </Text>
          <Text
            textType="paragraph"
            style={[
              styles.description,
              {
                color: isDark ? colors.text.content : COLORS.mediumGray,
              },
            ]}>
            {item.description}
          </Text>
        </View>
        {isSelected && (
          <View
            style={[
              styles.checkmark,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
      </Pressable>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {themeOptions.map((item, index) => (
          <View key={item.value}>
            {renderItem(item)}
            {index < themeOptions.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  text: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  itemContainer: {
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: SPACING.sm,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.sm,
  },
});


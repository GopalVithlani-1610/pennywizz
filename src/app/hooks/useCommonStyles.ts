import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from './useTheme';

/**
 * Hook to get theme-aware dynamic common styles
 * Use this instead of importing CommonStyles directly when you need theme-aware colors
 */
export function useCommonStyles() {
  const {colors} = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        flex1WithBg: {
          flex: 1,
          backgroundColor: colors.screenBackground,
        },
        screenContainerWithBg: {
          flex: 1,
          backgroundColor: colors.screenBackground,
        },
        smallLine: {
          backgroundColor: colors.separator,
        },
        separator: {
          borderColor: colors.separator,
        },
        subheadingTitle: {
          color: colors.text.subheading,
        },
        btnTextStyleWithColor: {
          color: colors.button.primary.text,
        },
        cardBackground: {
          backgroundColor: colors.cardBackground,
        },
        border: {
          borderColor: colors.border,
        },
      }),
    [colors],
  );
}

import {useRecoilState} from 'recoil';
import {useEffect, useMemo, useCallback} from 'react';
import {Appearance} from 'react-native';
import {KeyValueStorage} from '@/src/database';
import {
  themeModeAtom,
  systemColorSchemeAtom,
  ThemeMode,
} from '../state/utils.state';
import {ThemeColors} from '../theme';
import {DarkTheme, LightTheme, Theme} from '@react-navigation/native';

/**
 * Hook to manage theme state and get current theme
 * @returns Object with theme, isDark, themeMode, setThemeMode, and colors
 */
export function useTheme() {
  const [themeMode, setThemeModeState] = useRecoilState(themeModeAtom);
  const [systemColorScheme, setSystemColorScheme] = useRecoilState(systemColorSchemeAtom);
  
  // Load theme preference from storage on mount - only once
  useEffect(() => {
    let mounted = true;
    const loadThemePreference = async () => {
      try {
        const savedTheme = await KeyValueStorage.get('THEME_PREFERENCE');
        if (mounted && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    };
    loadThemePreference();
    return () => {
      mounted = false;
    };
  }, []); // Empty deps - only run once

  // Listen to system theme changes - only set once on mount
  useEffect(() => {
    const currentScheme = Appearance.getColorScheme();
    const initialScheme = currentScheme === 'dark' ? 'dark' : 'light';
    setSystemColorScheme(initialScheme);

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      const newScheme = colorScheme === 'dark' ? 'dark' : 'light';
      setSystemColorScheme(newScheme);
    });

    return () => subscription.remove();
  }, []); // Empty deps - only set up listener once

  // Memoize isDark calculation
  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  // Memoize theme calculation to prevent unnecessary re-renders
  const themeResult = useMemo(() => {
    const themeKey = isDark ? 'dark' : 'light';
    
    // Safely get theme colors with fallback
    const themeColors = ThemeColors[themeKey] || ThemeColors.light;

    // Get React Navigation theme with safety checks
    // Ensure we always have a valid theme object
    let navigationTheme: Theme;
    if (isDark) {
      navigationTheme = DarkTheme || LightTheme || {
        dark: true,
        colors: {
          primary: '#000000',
          background: '#000000',
          card: '#1E1E1E',
          text: '#FFFFFF',
          border: '#333333',
          notification: '#000000',
        },
      };
    } else {
      navigationTheme = LightTheme || DarkTheme || {
        dark: false,
        colors: {
          primary: '#000000',
          background: '#FFFFFF',
          card: '#FFFFFF',
          text: '#000000',
          border: '#CCCCCC',
          notification: '#000000',
        },
      };
    }

    // Ensure we have valid colors
    const baseColors = navigationTheme.colors || {
      primary: ThemeColors.light.primary,
      background: ThemeColors.light.screenBackground,
      card: ThemeColors.light.cardBackground,
      text: ThemeColors.light.text.heading,
      border: ThemeColors.light.border,
      notification: ThemeColors.light.primary,
    };

    const customTheme: Theme = {
      ...navigationTheme,
      colors: {
        ...baseColors,
        primary: themeColors.primary || baseColors.primary || ThemeColors.light.primary,
        background: themeColors.screenBackground || baseColors.background || ThemeColors.light.screenBackground,
        card: themeColors.cardBackground || baseColors.card || ThemeColors.light.cardBackground,
        text: themeColors.text?.heading || baseColors.text || ThemeColors.light.text.heading,
        border: themeColors.border || baseColors.border || ThemeColors.light.border,
        notification: themeColors.primary || baseColors.notification || ThemeColors.light.primary,
      },
      dark: isDark,
    };

    return {
      theme: customTheme,
      colors: themeColors,
    };
  }, [isDark, themeMode]);

  // Extract values from themeResult - these are already memoized
  const customNavigationTheme = themeResult?.theme;
  const currentThemeColors = themeResult?.colors || ThemeColors.light;

  // Memoize the final theme object - use themeResult directly to ensure it updates
  const safeTheme = useMemo(() => {
    // If we have a valid theme from themeResult, use it directly
    if (customNavigationTheme && typeof customNavigationTheme === 'object' && 'colors' in customNavigationTheme) {
      return customNavigationTheme;
    }
    
    // Fallback theme if customNavigationTheme is invalid
    return {
      dark: isDark,
      colors: {
        primary: currentThemeColors.primary || ThemeColors.light.primary,
        background: currentThemeColors.screenBackground || ThemeColors.light.screenBackground,
        card: currentThemeColors.cardBackground || ThemeColors.light.cardBackground,
        text: currentThemeColors.text?.heading || ThemeColors.light.text.heading,
        border: currentThemeColors.border || ThemeColors.light.border,
        notification: currentThemeColors.primary || ThemeColors.light.primary,
      },
    } as Theme;
  }, [isDark, customNavigationTheme, currentThemeColors]);

  // setThemeMode function - use useCallback instead of useMemo for functions
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await KeyValueStorage.set('THEME_PREFERENCE', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [setThemeModeState]);

  return {
    theme: safeTheme,
    isDark,
    themeMode: themeMode || 'system',
    setThemeMode,
    colors: currentThemeColors,
  };
}


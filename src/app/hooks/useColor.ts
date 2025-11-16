import {useLayoutEffect, useRef} from 'react';
import {Appearance} from 'react-native';

export default function Colors() {
  const mobileColorScheme = Appearance.getColorScheme() ?? 'light';
  return SCHEMECOLORS[mobileColorScheme];
}

/**
 * @description Returns colors based on the appearance.
 * @returns Object of type @SchemaColors
 */
export function useAdaptiveColors() {
  const colors = useRef<(typeof SCHEMECOLORS)['light']>();

  useLayoutEffect(() => {
    if (!colors.current) {
      colors.current = Colors();
    }
  }, []);

  return colors.current!;
}

export const SCHEMECOLORS = {
  light: {
    primary: '#3498db',
    secondary: '#f1c40f',
    tertiary: '#e74c3c',
    background: '#f9f9f9',
    text: '#34495e',
  },
  dark: {
    primary: '#3498db',
    secondary: '#f1c40f',
    tertiary: '#e74c3c',
    background: '#2c3e50',
    text: '#ffffff',
  },
};

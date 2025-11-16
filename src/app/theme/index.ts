export const COLORS = {
  primary: '#352593', // green color code
  white: '#FFFFFF',
  black: '#000000',
  gray: '#D3D3D3',
  red: '#E32636',
  lightGray: '#F1F1F1',
  darkGray: '#333333',
  secondry: '#F4B41A',
  mediumGray: '#666666',
  placeholder: '#AAAAAA',
  overlay: 'rgba(0,0,0,0.1)',
  greenReport: '#008000',
  lightRed: '#fde4e4',
  lightGreen: '#e5ffe4',
  lightPrimary: '#EBE9F4',
  darkPrimary: '#1B134A',
  subHeadingText: '#1c2226',
  categoryImgBackground: 'rgba(217,217,217,0.26)',
  slightOffWhite: '#FAFAFA',
  lightPrimaryBackground: '#fcf4ed',
  darkSecondry: '#7A5A0D',
};

export const ThemeColors = {
  light: {
    primary: COLORS.primary,
    secondry: COLORS.secondry,
    screenBackground: COLORS.white,
    text: {
      heading: COLORS.black,
      subheading: COLORS.subHeadingText,
      content: COLORS.darkGray,
    },
    button: {
      primary: {
        bg: COLORS.primary,
        text: COLORS.white,
      },
    },
    cardBackground: COLORS.white,
    border: COLORS.lightGray,
    inputBackground: COLORS.slightOffWhite,
    icon: COLORS.darkGray, // Dark color for icons in light mode
    iconInactive: COLORS.mediumGray, // Medium gray for inactive icons
    separator: COLORS.lightGray, // Light separators
  },
  dark: {
    primary: '#6B5FD9', // Brighter purple for better visibility
    secondry: '#FFC107', // Vibrant amber/yellow for better contrast
    screenBackground: '#121212', // Material Design dark background
    text: {
      heading: '#FFFFFF', // Pure white for maximum contrast
      subheading: '#E0E0E0', // High emphasis text (87% white)
      content: '#B3B3B3', // Medium emphasis text (60% white)
    },
    button: {
      primary: {
        bg: '#6B5FD9', // Brighter primary for dark mode
        text: '#FFFFFF',
      },
    },
    cardBackground: '#1E1E1E', // Elevated surface (slightly lighter)
    border: '#3A3A3A', // More visible border with better contrast
    inputBackground: '#2C2C2C', // Better contrast for inputs
    icon: '#E0E0E0', // High emphasis icons
    iconInactive: '#757575', // Medium gray for inactive (better visibility)
    separator: '#3A3A3A', // More visible separators
  },
};
const baseTextSize = 14;
export const headerTextSize = baseTextSize * 2;
export const subHeadingTextSize = baseTextSize * 1.5;

const baseSpacing = 8;

export const SPACING = {
  md: baseSpacing * 2,
  sm: baseSpacing,
  big: baseSpacing * 3,
  custom: (scale: number) => baseSpacing * scale,
};

export const BORDER_RADIUS = {
  md: 16,
  full: 1000,
  sm: 8,
};

const FONT_FAMILY = 'Metropolis-';

export const FONTS = {
  bold: FONT_FAMILY + 'Bold',
  semiBold: FONT_FAMILY + 'SemiBold',
  regular: FONT_FAMILY + 'Regular',
  medium: FONT_FAMILY + 'Medium',
  black: FONT_FAMILY + 'Black',
};

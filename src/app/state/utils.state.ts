import {KeyValueStorage} from '@/src/database';
import {atom, selector} from 'recoil';
import {Appearance} from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export const premiumUtilAtom = atom({
  key: 'premiumUserAtom',
  default: false,
});

export const globalAppState = atom({
  key: 'globalState',
  default: selector({
    key: 'globalState/Default',
    get: async () => {
      const value = await KeyValueStorage.get('ONBOARDING_JOURNEY_COMPLETED');
      return !!value;
    },
  }),
});

export const themeModeAtom = atom<ThemeMode>({
  key: 'themeModeAtom',
  default: 'system', // Start with system, will be loaded from storage in useTheme hook
});

// Atom to track system color scheme changes
export const systemColorSchemeAtom = atom<'light' | 'dark'>({
  key: 'systemColorSchemeAtom',
  default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
});

export const isDarkModeSelector = selector({
  key: 'isDarkModeSelector',
  get: ({get}) => {
    try {
      const themeMode = get(themeModeAtom) || 'system';
      if (themeMode === 'system') {
        const systemColorScheme = get(systemColorSchemeAtom) || 'light';
        return systemColorScheme === 'dark';
      }
      return themeMode === 'dark';
    } catch (error) {
      // Fallback to system appearance if selector fails
      const systemScheme = Appearance.getColorScheme();
      return systemScheme === 'dark';
    }
  },
});

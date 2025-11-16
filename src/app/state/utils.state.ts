import {KeyValueStorage} from '@/src/database';
import {atom, selector} from 'recoil';

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

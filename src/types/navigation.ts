import {CompositeScreenProps, ParamListBase} from '@react-navigation/native';
import {CategoryEntity, TransactionEntity} from './domainTypes';
import {StackScreenProps} from '@react-navigation/stack';

export type TBottomTabScreens = {
  Dashboard: undefined;
  Accounts: undefined;
  Spendings: undefined;
  Transactions: undefined;
  Editor: undefined;
};

export type TDetailStackScreen = {
  Spendings$$:
    | {
        open: 'AllocateMoneyModal';
      }
    | undefined;
  CategoryDetail: {
    categoryName: string;
  };
  Report: undefined;
  Search: undefined;
};

type TSettingStackHelper = {
  [key in keyof TSettingStackScreen]: {
    screen: key;
    params: TSettingStackScreen[key];
  };
}[keyof TSettingStackScreen];

export type TSettingStackScreen = {
  Settings$$:
    | undefined
    | {
        open: 'Categories' | 'Currency';
      };
  Edit: {
    category?: Readonly<CategoryEntity>;
    comingFrom: 'Category' | 'Currency';
    type?: 'New';
  };
};

export type TOnboardingStackScreen = {
  AmountInsertion: undefined;
  CategorySelection: undefined;
};
export type TDashboardStackScreen = {
  Dashboard$$: undefined;
  Charts: undefined;
};

export type RootStack = {
  __TABS__: undefined;
  TransactionEditor?: TransactionEntity;
  Playground: undefined;
  Settings: undefined | TSettingStackHelper;
};

export type CompositeRootStack<
  T extends ParamListBase,
  K extends keyof T & string,
> = CompositeScreenProps<StackScreenProps<T, K>, StackScreenProps<RootStack>>;

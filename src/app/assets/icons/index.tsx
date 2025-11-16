import React from 'react';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import config from './selection.json';
import {StyleProp} from 'react-native';
import {TextStyle} from 'react-native';
const Icons = createIconSetFromIcoMoon(config);

export type IconType =
  | 'calendar'
  | 'wallet'
  | 'spendings'
  | 'settings'
  | 'dashboard'
  | 'barChart'
  | 'chevronDown'
  | 'document'
  | 'circleWithPlus'
  | 'gavel'
  | 'lock'
  | 'mail'
  | 'currency'
  | 'search'
  | 'trending-up'
  | 'trending-down'
  | 'user'
  | 'card'
  | 'chevron-right'
  | 'chevron-down'
  | 'share'
  | 'cross'
  | 'grid'
  | 'csv'
  | 'external-link'
  | 'check'
  | 'oct-cross'
  | 'edit-pencil'
  | 'testtube'
  | 'label'
  | 'trash';
export default function BhIcon(props: {
  name: IconType;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  return <Icons {...props} />;
}

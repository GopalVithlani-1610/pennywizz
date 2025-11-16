import React from 'react';
import {View} from 'react-native';
import CommonStyles from '@/app/styles';
import {COLORS, SPACING} from '@/app/theme';
type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingBottom?: number;
};
const Screen = ({
  children,
  backgroundColor = '#FCFDFD',
  paddingBottom = SPACING.md,
  paddingHorizontal = SPACING.md,
}: Props) => {
  return (
    <View
      style={[
        CommonStyles.screenContainer,
        {backgroundColor, paddingHorizontal, paddingBottom},
      ]}>
      {children}
    </View>
  );
};

Screen.Onboarding = (props: Props) => (
  <Screen backgroundColor={COLORS.lightPrimary} {...props} />
);
export default Screen;

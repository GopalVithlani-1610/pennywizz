import React from 'react';
import {View} from 'react-native';
import CommonStyles from '@/app/styles';
import {COLORS, SPACING} from '@/app/theme';
import {useTheme} from '@/app/hooks/useTheme';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingBottom?: number;
};
const Screen = ({
  children,
  backgroundColor,
  paddingBottom = SPACING.md,
  paddingHorizontal = SPACING.md,
}: Props) => {
  const {colors} = useTheme();
  const defaultBackgroundColor = backgroundColor || colors.screenBackground;
  
  return (
    <View
      style={[
        CommonStyles.screenContainer,
        {backgroundColor: defaultBackgroundColor, paddingHorizontal, paddingBottom},
      ]}>
      {children}
    </View>
  );
};

Screen.Onboarding = (props: Props) => (
  <Screen backgroundColor={COLORS.lightPrimary} {...props} />
);
export default Screen;

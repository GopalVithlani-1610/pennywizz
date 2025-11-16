import {Text} from '@/src/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import React, {PropsWithChildren} from 'react';
import {View, StyleSheet} from 'react-native';

type Props = PropsWithChildren & {
  header: string;
};
export default (props: Props) => {
  return (
    <View style={styles.contentContainer}>
      <Text textType="subheading" style={styles.heading}>
        {props.header}
      </Text>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightPrimary,
    borderRadius: BORDER_RADIUS.sm,
    padding: 2, // FOR PROPERLY RENDERING OUT THE BORDERRADIUS,
    // borderStyle: 'dotted',
    marginVertical: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  heading: {
    color: COLORS.subHeadingText,
    fontSize: 10,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
    marginTop: SPACING.sm,
  },
});

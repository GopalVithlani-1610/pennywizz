import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';

type Props = {
  title: string;
  children?: ReactElement;
};

export default (props: Props) => {
  return (
    <View style={styles.container}>
      <Text textType="subheading" style={styles.title}>
        {props.title}
      </Text>
      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.big,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.sm,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  title: {
    color: COLORS.darkSecondry,
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  childrenContainer: {
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.custom(0.5),
  },
});

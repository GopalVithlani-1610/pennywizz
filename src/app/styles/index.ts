import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '../theme';

const shadow = {elevation: 3, shadowColor: COLORS.secondry};
export const createConditionalStyle = (
  evalaution: boolean,
  toApplyStyle: any,
  elseApplyStyle: any = {},
) => (evalaution ? toApplyStyle : elseApplyStyle);
const CommonStyles = StyleSheet.create({
  flex1: {flex: 1},
  backdrop: {
    backgroundColor: COLORS.overlay,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLine: {
    width: 40,
    height: 3,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },

  btnStyle: {
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  btnTextStyle: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
  },
  ctaShadow: shadow,
  btnRipple: {
    color: COLORS.lightGray,
    // borderless: true,
    // radius: BORDER_RADIUS.md,
    // foreground: true,
  },
  separator: {borderBottomWidth: 0.5},
  subheadingTitle: {
    marginHorizontal: SPACING.md,
    fontSize: 18,
  },
});

export default CommonStyles;

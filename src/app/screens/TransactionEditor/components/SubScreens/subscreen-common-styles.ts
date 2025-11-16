import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import {StyleSheet} from 'react-native';

export const subscreenCommonStyles = StyleSheet.create({
  input: {
    color: COLORS.black,
    padding: 0,
    flexDirection: 'row',
    flex: 1,
    borderWidth: 0,
  },
  addEditCategory: {
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    top: -SPACING.sm,
  },
  addEditCategoryText: {
    fontSize: 12,
    color: COLORS.darkPrimary,
  },
  notesInput: {
    color: COLORS.black,
    padding: 0,
    flexDirection: 'row',
    flex: 1,
    borderWidth: 0,
    minHeight: 40,
  },
  itemStyle: {
    padding: SPACING.md,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: BORDER_RADIUS.md,
    ...CommonStyles.displayRow,
    // elevation: 1,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: COLORS.secondry,
  },
  bottomSheetContentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
    paddingVertical: SPACING.big,
    paddingHorizontal: SPACING.sm,
  },
});

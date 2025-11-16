import {ExpenseCategories, IncomeCategories} from '@/src/app/assets/data';
import {
  CaptionText,
  Header,
  Pressable,
  PressableTextButton,
  Screen,
  Text,
} from '@/src/app/components';
import AnalyticsManager, {
  AnalyticsEventKeys,
} from '@/src/app/services/AnalyticsManager';
import {globalAppState} from '@/src/app/state/utils.state';
import CommonStyles, {createConditionalStyle} from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import Utils from '@/src/app/utils';
import {categoryDatabaseInstance, KeyValueStorage} from '@/src/database';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {useSetRecoilState} from 'recoil';

export default () => {
  const [selectedCategory, setSelectedCategory] = React.useState<number[]>(
    new Array(ExpenseCategories.length).fill(-1).map((_, i) => i + 1),
  );
  const setAppState = useSetRecoilState(globalAppState);
  const navigateToTheDashboard = async () => {
    AnalyticsManager.remoteLog(AnalyticsEventKeys.OnboardingJourney);
    await categoryDatabaseInstance().saveCategoryList([
      ...ExpenseCategories.filter(
        a => selectedCategory.indexOf(a.key) > -1,
      ).map(a => ({...a, type: 0})),
      ...IncomeCategories.map(a => ({...a, type: 1})),
    ]);
    await KeyValueStorage.set('ONBOARDING_JOURNEY_COMPLETED', 'true');
    setAppState(true);
  };

  const renderItem = useCallback(
    (item: (typeof ExpenseCategories)[0]) => {
      let currentlyPosition: number = selectedCategory.indexOf(item.key);
      return (
        <Pressable
          onPress={() => {
            setSelectedCategory(e => {
              if (
                ((currentlyPosition = e.indexOf(item.key)) ||
                  currentlyPosition === 0) &&
                currentlyPosition !== -1
              ) {
                e.splice(currentlyPosition, 1);
              } else {
                e.push(item.key);
              }
              return [...e];
            });
          }}
          key={item.key}
          style={[
            {
              backgroundColor: COLORS.white,
              padding: SPACING.sm - 2,
              borderRadius: BORDER_RADIUS.full,
              ...CommonStyles.displayRow,
            },
            createConditionalStyle(
              Utils.isNotNullAndNotEqualsTo(currentlyPosition, -1),
              {
                borderWidth: 0.5,
                borderColor: COLORS.secondry,
              },
            ),
          ]}>
          <View style={styles.cardStyle}>
            <Text style={{fontSize: 10}}>{item.emoji}</Text>
          </View>
          <Text textType="normal" style={{fontSize: 12}}>
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [selectedCategory],
  );
  return (
    <Screen.Onboarding>
      <Header headerTitle="Spendsure" />

      <View style={styles.contentContainer}>
        <Text
          textType="heading"
          style={createConditionalStyle(selectedCategory.length > 0, {
            fontFamily: FONTS.black,
          })}>
          {selectedCategory.length === 0
            ? 'Choose Categories'
            : selectedCategory.length + ' Selected'}
        </Text>
        <Text style={styles.captionText} textType="subheading">
          You can make your selections now or add them later at any time. Create
          custom category later in settings
        </Text>

        <View>
          <Text style={{marginBottom: SPACING.sm}}>Expense</Text>
          <View style={styles.categoryListContainer}>
            {ExpenseCategories.map(category => {
              return renderItem(category);
            })}
          </View>
        </View>
      </View>
      <Pressable onPress={navigateToTheDashboard} style={CommonStyles.btnStyle}>
        <Text style={CommonStyles.btnTextStyle}>Jump to the app 😍</Text>
      </Pressable>
      <CaptionText style={{textAlignVertical: 'center', fontSize: 10}}>
        By using the app, you agree to
        <PressableTextButton
          text="Privacy Policy"
          //TODO: Update Privacy Policy URI
          onPress={() => Linking.openURL('').catch(_ => {})}
          textStyle={styles.privacyPolicyText}
        />
      </CaptionText>
    </Screen.Onboarding>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1, justifyContent: 'center', marginTop: SPACING.big},
  captionText: {
    textAlign: 'center',
    marginBottom: SPACING.big,
    fontSize: 12,
    color: COLORS.subHeadingText,
    marginTop: SPACING.md,
  },
  cardStyle: {
    padding: SPACING.sm,
    backgroundColor: COLORS.categoryImgBackground,
    borderRadius: BORDER_RADIUS.full,
    marginRight: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyPolicyText: {
    color: COLORS.black,
    textDecorationLine: 'underline',
    marginLeft: SPACING.sm,
    fontSize: 14,
    top: 4,
  },
  categoryListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm - 4,
  },
});

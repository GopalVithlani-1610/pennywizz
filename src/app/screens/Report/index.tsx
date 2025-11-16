import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ChooseCategory,
  Loader,
  Pressable,
  Screen,
  Text,
  useToastContext,
} from '@/app/components';
import {buildCsv} from '@/app/helper';
import CommonStyles from '@/app/styles';
import {COLORS, SPACING} from '@/app/theme';
import Utils from '@/app/utils';
import BhIcon from '@/app/assets';
import DatePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  payeeDatabaseInstance,
  transactionDatabaseInstance,
} from '@/src/database';
import {useRecoilValue} from 'recoil';
import {categoriesState} from '@/app/state';
import {transactionCategoryPayeeLinked} from '@/src/database/utils';

export default () => {
  const categories = useRecoilValue(categoriesState);
  const toast = useToastContext();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map(a => a.id),
  );
  const [whatVisible, setWhatVisible] = React.useState<
    'fromDate' | 'toDate' | 'category' | undefined
  >();
  const [state, setState] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    categories: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const toggleFilterSelection = (
    clickedOn: 'fromDate' | 'toDate' | 'category' | undefined,
  ) => {
    setWhatVisible(clickedOn);
  };

  const setDate = (event: DateTimePickerEvent, date: Date | undefined) => {
    if (event.type === 'set' && date) {
      const selectedDate = new Date(event.nativeEvent.timestamp);
      if (whatVisible === 'fromDate') {
        setState({...state, fromDate: selectedDate});
      }
      if (whatVisible === 'toDate') {
        if (date < state.fromDate) {
          return toast.show('To date cannot be before than from date', 'Error');
        }
        setState({...state, toDate: selectedDate});
      }
      toggleFilterSelection(undefined);
    } else {
      toggleFilterSelection(undefined);
    }
  };

  const generateCsv = async () => {
    try {
      //no need of permission as the downloading is being done in download folder.
      setIsLoading(true);
      const transactions =
        await transactionDatabaseInstance().getTransactionsBetweenDate(
          state.fromDate,
          state.toDate,
          selectedCategories,
        );
      const payees = await payeeDatabaseInstance().getAllPayee();
      if (transactions.length === 0) {
        return toast.show('No Bills found for the selected filter', 'Success');
      }
      const transactionLinked = transactionCategoryPayeeLinked(
        transactions,
        categories,
        payees,
      );
      await buildCsv(transactionLinked);

      toast.show(
        'Report has been generated successfully! You can find it in your Documents folder.',
        'Success',
      );
      Utils.vibrate();
    } catch (err: any) {
      toast.show('Failed to save report, Error: ' + err.message, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <View style={CommonStyles.center}>
        <Text
          textType="heading"
          style={{
            fontSize: 30,
            marginBottom: SPACING.big,
            textAlign: 'center',
          }}>
          Export Data{' '}
        </Text>
        <Text textType="normal" style={styles.caption}>
          Export your transactions as csv and use them in Excel, Sheets
        </Text>
        <View style={styles.filterContainerWrapper}>
          <Pressable
            onPress={() => toggleFilterSelection('fromDate')}
            style={styles.filterContainer}
            animated={false}>
            <Text style={styles.filterText}>
              <Text style={styles.label}>From</Text>{' '}
              {state.fromDate.toDateString()}
            </Text>
            <BhIcon size={18} name="calendar" />
          </Pressable>
          <Pressable
            onPress={() => toggleFilterSelection('toDate')}
            style={[styles.filterContainer, {borderBottomWidth: 0}]}
            animated={false}>
            <Text style={styles.filterText}>
              <Text style={styles.label}>To</Text> {state.toDate.toDateString()}
            </Text>
            <BhIcon size={18} name="calendar" />
          </Pressable>
        </View>
        <View style={[styles.filterContainerWrapper, {marginTop: SPACING.sm}]}>
          <Pressable
            onPress={() => toggleFilterSelection('category')}
            style={[styles.filterContainer, {borderBottomWidth: 0}]}
            animated={false}>
            <Text style={styles.filterText}>
              Categories{' '}
              <Text style={styles.label}>
                (
                {selectedCategories.length > 5
                  ? '5+'
                  : selectedCategories.length}{' '}
                selected)
              </Text>
            </Text>
            <Text textType="paragraph" style={{fontSize: 18}}>
              😄 <BhIcon size={18} name="grid" />
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={generateCsv}
          style={[
            CommonStyles.btnStyle,
            CommonStyles.displayRow,
            styles.actionBtn,
          ]}>
          {/* <BhIcon name="grid" color={COLORS.white} size={20} /> */}
          <Text style={{color: COLORS.white, marginLeft: SPACING.sm}}>
            Export CSV
          </Text>
        </Pressable>
      </View>
      {whatVisible && whatVisible.toLowerCase().indexOf('date') >= 1 && (
        <DatePicker
          onChange={setDate}
          value={new Date()}
          accentColor={COLORS.white}
          textColor={COLORS.white}
          minimumDate={whatVisible === 'toDate' ? state.fromDate : undefined}
        />
      )}
      {whatVisible === 'category' && (
        <ChooseCategory
          onDone={setSelectedCategories}
          initialValue={selectedCategories}
          byDefaultSelectAll
          isMultiSelect
          onClose={() => toggleFilterSelection(undefined)}
          show="all"
        />
      )}
      <Loader show={isLoading} text="Generating CSV..." />
    </Screen>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: SPACING.md,
    borderBottomColor: '#DBDBDB',
  },
  caption: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.big,
  },
  actionBtn: {
    width: '100%',
    marginTop: SPACING.big,
  },
  filterContainerWrapper: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.lightGray,
  },
  filterText: {fontSize: 16, color: COLORS.subHeadingText},
  label: {
    color: COLORS.primary,
    fontSize: 12,
  },
});

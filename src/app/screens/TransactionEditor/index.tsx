import React, {useEffect} from 'react';
import {
  Platform,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  BackHandler,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StackScreenProps} from '@react-navigation/stack';
import {NavigationTypes} from '@/src/types';
import CommonStyles from '@/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import {transactionDatabaseInstance} from '@/src/database';
import Utils from '@/app/utils';
import {
  CurrencyInput,
  Header,
  Pressable,
  PressableTextButton,
  Screen,
  SwirlyLines,
  Text,
  useToastContext,
} from '@/app/components';
import {useTransaction} from './components';
import ExpenseScreen from './components/SubScreens/ExpenseScreen';
import IncomeScreen from './components/SubScreens/IncomeScreen';
import {validateTransaction} from './helper';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  appCurrentMonthAndYearState,
  transactionsByMonthState,
} from '@/app/state';
import {TransactionCategoriesLinkEntity} from '@/src/types/domainTypes';
import {captureException} from '@sentry/react-native';
import {DateHelper} from '@/app/helper';
import {CompositeScreenProps} from '@react-navigation/native';
import BhIcon from '../../assets/icons';

export type TransactionEditorScreenProps = CompositeScreenProps<
  StackScreenProps<NavigationTypes.RootStack, 'TransactionEditor'>,
  StackScreenProps<NavigationTypes.TBottomTabScreens>
>;

const {width} = Dimensions.get('window');

const TransactionEditor = ({
  navigation,
  route,
}: TransactionEditorScreenProps) => {
  const toast = useToastContext();
  const {
    transactionEntry,
    setTransactionEntry,
    categories,
    setSelectedSubScreen,
    isEditScreen,
    selectedSubScreen,
    accounts,
    resetState,
  } = useTransaction(route.params);
  const setTransactionsInRecoil = useSetRecoilState(transactionsByMonthState);
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const appMonthAndYear = useRecoilValue(appCurrentMonthAndYearState);
  const onActionPressed = async () => {
    try {
      validateTransaction({
        amount: transactionEntry.amount,
        category: transactionEntry.category,
        transactionDate: transactionEntry.transactionDate,
        notes: transactionEntry.notes,
        account: transactionEntry.account,
      });
      if (isEditScreen) {
        if (!route.params || !route.params.id) {
          throw new Error('Transaction not found.Kindly refresh the app.');
        }
        await transactionDatabaseInstance().updateTransaction(
          route.params.id,
          {
            amount: transactionEntry.amount,
            transactionDate: transactionEntry.transactionDate,
            notes: transactionEntry.notes,
            category: transactionEntry.category!.id,
            payee: transactionEntry.payee,
            account: transactionEntry.account!,
          },
          transactionEntry.category!,
        );
        toast.show('Transaction updated succesfully.', 'Success');

        const hasSameMonthAndYear = DateHelper.hasSameMonthAndYear(
          transactionEntry.transactionDate,
          new Date(appMonthAndYear.year, appMonthAndYear.month, 1),
        );
        if (hasSameMonthAndYear) {
          setTransactionsInRecoil(transactions => {
            return transactions.map(transaction => {
              if (transaction.id === route.params!.id) {
                const newReference = Object.assign({}, transaction);
                newReference.amount = transactionEntry.amount;
                newReference.notes = transactionEntry.notes;
                newReference.category = transactionEntry.category!;
                newReference.payee = transactionEntry.payee;
                newReference.account = transactionEntry.account!;
                return newReference;
              }
              return transaction;
            });
          });
        }
      } else {
        const id = await transactionDatabaseInstance().createTransaction(
          {
            amount: transactionEntry.amount,
            transactionDate: transactionEntry.transactionDate,
            notes: transactionEntry.notes,
            category: transactionEntry.category!.id,
            payee: transactionEntry.payee,
            account: transactionEntry.account!,
          },
          transactionEntry.category!,
        );

        toast.show('Transaction created succesfully.', 'Success');

        //CANHAVE: can have some kind of mechanism to have some update state helper. single and only to update global state.
        const hasSameMonthAndYear = DateHelper.hasSameMonthAndYear(
          transactionEntry.transactionDate,
          new Date(appMonthAndYear.year, appMonthAndYear.month, 1),
        );
        if (hasSameMonthAndYear) {
          setTransactionsInRecoil(transactions => {
            const newTransactions = Object.assign(
              [] as TransactionCategoriesLinkEntity[],
              transactions,
            );
            newTransactions.push({
              amount: transactionEntry.amount,
              transactionDate: transactionEntry.transactionDate,
              notes: transactionEntry.notes,
              category: transactionEntry.category!,
              payee: transactionEntry.payee,
              id,
              account: transactionEntry.account!,
            });
            return newTransactions;
          });
        }
      }
      navigation.pop();
    } catch (err: any) {
      toast.show(err.message, 'Error');
    }
    Utils.vibrate();
  };

  const deleteBill = async () => {
    Utils.makeAlert(
      'Are you sure?',
      'Deleted bill will not get recovered again.',
      async () => {
        if (isEditScreen && route.params?.id) {
          try {
            await transactionDatabaseInstance().deleteTransaction(
              route.params.id,
            );
            toast.show('Transaction deleted successfully.', 'Success');
            setTransactionsInRecoil(transactions => {
              const allTransactions = transactions.filter(
                transaction => transaction.id !== route.params!.id,
              );
              return Object.assign([], allTransactions);
            });
            navigation.pop();
          } catch (err: any) {
            toast.show(err.message, 'Error');
            captureException(err, {
              data: {
                fn: 'DeleteTransaction',
              },
            });
          }
        }
      },
      true,
    );
  };

  // for back button compatibility.
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      Keyboard.dismiss(); // if keyboard got open.
      navigation.pop();
      return true;
    });
    return () => {
      Keyboard.dismiss(); // if keyboard got open.
      handler.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Screen>
      <Header
        headerRight={
          <Pressable onPress={() => navigation.pop()}>
            <BhIcon name="cross" size={14} style={{marginRight: SPACING.sm}} />
          </Pressable>
        }
        headerTitle={isEditScreen ? 'Edit Transaction' : 'Create Transaction'}
      />
      {/* <SwirlyLines width={width - SPACING.md * 2} color={COLORS.gray} /> */}
      <ScrollView style={{marginTop: SPACING.md}}>
        {!isEditScreen && (
          <View style={styles.incomeExpenseSelectionContainer}>
            <>
              <PressableTextButton
                onPress={() => {
                  if (selectedSubScreen !== 'expense') {
                    resetState();
                    setSelectedSubScreen('expense');
                  }
                }}
                style={[
                  CommonStyles.flex1,
                  styles.commonSelection,
                  selectedSubScreen === 'expense'
                    ? styles.selectedSelection
                    : styles.unselectedSelection,
                ]}
                textType="subheading"
                textStyle={
                  selectedSubScreen === 'expense'
                    ? styles.blackText
                    : styles.unselectedText
                }
                text="Expense"
              />
              <PressableTextButton
                onPress={() => {
                  if (selectedSubScreen !== 'income') {
                    resetState();
                    setSelectedSubScreen('income');
                  }
                }}
                style={[
                  CommonStyles.flex1,
                  styles.commonSelection,
                  selectedSubScreen === 'income'
                    ? styles.selectedSelection
                    : styles.unselectedSelection,
                ]}
                textType="subheading"
                textStyle={
                  selectedSubScreen === 'income'
                    ? styles.blackText
                    : styles.unselectedText
                }
                text="Income"
              />
            </>
          </View>
        )}
        <View style={styles.amountContainer}>
          <CurrencyInput
            autoFocused={!isEditScreen}
            initialValue={transactionEntry.amount}
            amountTextStyle={styles.textInput}
            currencySymbolStyle={styles.currencySymbolStyle}
            onInputChange={amount => setTransactionEntry('amount', amount)}
          />
        </View>

        {selectedSubScreen === 'expense' ? (
          <ExpenseScreen
            accounts={accounts}
            transactionEntry={transactionEntry}
            setTransactionEntry={setTransactionEntry}
            categories={categories}
            isCreate={!isEditScreen}
            navigation={navigation}
            toggleDatePicker={setOpenDatePicker}
          />
        ) : (
          <IncomeScreen
            transactionEntry={transactionEntry}
            setTransactionEntry={setTransactionEntry}
            categories={categories}
            isCreate={!isEditScreen}
            navigation={navigation}
            toggleDatePicker={setOpenDatePicker}
            accounts={accounts}
          />
        )}
      </ScrollView>
      {openDatePicker && (
        <DateTimePicker
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          value={transactionEntry.transactionDate}
          mode={'date'}
          onChange={({nativeEvent}: {nativeEvent: any}) => {
            const newDate = nativeEvent.timestamp
              ? new Date(nativeEvent.timestamp)
              : transactionEntry.transactionDate;
            setOpenDatePicker(false);
            setTransactionEntry('transactionDate', newDate);
          }}
        />
      )}
      <Pressable onPress={onActionPressed} style={styles.actionBtnContainer}>
        <Text textType="subheading" style={styles.actionBtnText}>
          {isEditScreen ? 'Edit' : 'Create'}
        </Text>
      </Pressable>
      {isEditScreen && (
        <PressableTextButton
          text="Delete"
          textStyle={styles.deleteText}
          onPress={deleteBill}
          style={styles.delete}
          textType="normal"
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  incomeExpenseSelectionContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 20,
    overflow: 'hidden',
    // backgroundColor: COLORS.slightOffWhite,
    marginHorizontal: SPACING.sm,
  },
  commonSelection: {
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  selectedSelection: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: BORDER_RADIUS.full,
    color: COLORS.secondry,
  },
  unselectedSelection: {
    // backgroundColor: COLORS.slightOffWhite,
  },
  blackText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  unselectedText: {
    color: COLORS.gray,
    fontSize: 14,
    // fontWeight: '300',
  },
  delete: {
    backgroundColor: COLORS.slightOffWhite,
    padding: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  deleteText: {
    color: COLORS.red,
    fontSize: 16,
    textAlign: 'center',
    // textAlign: 'center',
  },
  textInput: {
    padding: 0,
    marginLeft: 10,
    color: COLORS.black,
    fontSize: 40,
    fontFamily: FONTS.semiBold,
    textAlign: 'left',
  },
  actionBtnContainer: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm + 4,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  actionBtnText: {
    fontSize: 16,
    color: COLORS.white,
  },
  currencySymbolStyle: {
    fontSize: 35,
    color: COLORS.mediumGray,
    opacity: 0.5,
  },
  amountContainer: {
    ...CommonStyles.displayRow,
    justifyContent: 'center',
  },
});

export default TransactionEditor;

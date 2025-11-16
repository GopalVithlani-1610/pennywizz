import React, {useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  BottomSheetScreen,
  BottomSheetScreenRef,
  CaptionText,
  CurrencyInput,
  Header,
  Pressable,
  PressableIconButton,
  RowItemWithLabel,
  Screen,
  Text,
  TextInput,
  TextInputStyles,
  useToastContext,
} from '@/app/components';
import {accountDatabaseInstance} from '@/src/database';
import {withGetEffect} from '@/app/hof';
import {AccountCard} from './components/AccountCard';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import CommonStyles from '@/app/styles';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {AccountEntity} from '@/src/types/domainTypes';
import {noop} from '@/src/app/helper';

export default withGetEffect(
  () => accountDatabaseInstance().getAllAccounts(),
  props => {
    const toast = useToastContext();
    const bottomSheetScreenRef = useRef<BottomSheetScreenRef>(null);
    const [accountDetail, setAccountDetail] = useState<{
      name: string;
      amount: number;
      type: 'Create' | 'Edit';
      id?: string;
    }>({
      name: '',
      amount: 0,
      type: 'Create',
    });

    const validate = () => {
      const {name, type, id} = accountDetail;
      if (name.length === 0) {
        throw new Error("Name can't be kept empty");
      }
      if (type === 'Edit' && !id) {
        throw new Error('Something went wrong here. Please refresh the app.');
      }
    };
    const onCreate = async () => {
      const accountName = accountDetail.name.trim();
      try {
        validate();
        if (accountDetail.type === 'Create') {
          await accountDatabaseInstance().createNewAccount({
            name: accountName,
            amount: accountDetail.amount,
          });
          toast.show('Account Created successfully.', 'Success');
        } else {
          await accountDatabaseInstance().updateAccount({
            name: accountName,
            amount: accountDetail.amount,
            id: accountDetail.id!,
          });
          toast.show('Account Edited successfully.', 'Success');
        }
        // can add the entry to the list directly.
        props.query(); //refetch
      } catch (e: any) {
        toast.show(e.message, 'Error');
      }
    };

    const onAccountPress = (acc: AccountEntity) => {
      setAccountDetail({
        amount: acc.amount,
        name: acc.name,
        type: 'Edit',
        id: acc.id,
      });
      bottomSheetScreenRef.current?.toggleBottomSheetScreen();
    };

    if (props.error) {
      toast.show('Failed to fetch data : ' + props.error, 'Error');
      return null;
    }
    return (
      <Screen>
        <Header headerTitle="Accounts" />
        <Text
          textType="subheading"
          style={{
            marginTop: SPACING.big,
            marginBottom: SPACING.sm,
            color: COLORS.mediumGray,
          }}>
          {' '}
          Checking{' '}
          <CaptionText style={{color: COLORS.secondry}} fontSize={12}>
            ({props.data.length})
          </CaptionText>
        </Text>
        <ScrollView contentContainerStyle={styles.accountsContainer}>
          {props.data.map(account => (
            <AccountCard
              onAccountPress={onAccountPress}
              key={account.id}
              account={account}
            />
          ))}
        </ScrollView>
        <BottomSheetScreen
          beforeScreenOpen={() =>
            setAccountDetail({type: 'Create', amount: 0, name: ''})
          }
          ref={bottomSheetScreenRef}
          component={
            <PressableIconButton
              iconName="circleWithPlus"
              style={{
                width: 65,
                height: 65,
                backgroundColor: COLORS.lightPrimary,
                borderRadius: BORDER_RADIUS.full,
                justifyContent: 'center',
                alignItems: 'center',
                // ...CommonStyles.ctaShadow,
                // elevation: 1,
                position: 'absolute',
                right: 15,
                bottom: 25,
                // alignSelf: 'flex-end',
              }}
              iconStyle={{size: 40, color: COLORS.primary}}
              onPress={noop}
              // ={{backgroundColor: COLORS.primary}}
            />
          }
          headerTitle={`${accountDetail.type} account`}>
          <CaptionText>
            We’re working on adding more account options just for you.
          </CaptionText>
          <RowItemWithLabel childrenStyle={{padding: SPACING.sm}} text="Name">
            <View>
              <BottomSheetTextInput
                maxLength={20}
                placeholderTextColor={COLORS.lightGray}
                style={[{color: COLORS.black}, TextInputStyles.removePadding]}
                placeholder="Name"
                value={accountDetail.name}
                onChangeText={(v: string) => {
                  setAccountDetail({...accountDetail, name: v});
                }}
              />
            </View>
          </RowItemWithLabel>
          <RowItemWithLabel
            childrenStyle={{backgroundColor: COLORS.categoryImgBackground}}
            text="Type">
            <TextInput
              style={{
                color: COLORS.black,
              }}
              placeholder="Checking"
              value="Checking"
              editable={false}
              onChangeText={() => {}}
            />
          </RowItemWithLabel>
          <RowItemWithLabel
            childrenStyle={{
              padding: SPACING.sm,
              paddingVertical: SPACING.custom(1.5),
            }}
            text="Amount">
            <CurrencyInput
              autoFocused={false}
              isWithinBottomSheet
              onInputChange={_amount =>
                setAccountDetail({...accountDetail, amount: _amount})
              }
              initialValue={accountDetail.amount}
              currencySymbolStyle={{fontSize: 14, fontFamily: FONTS.medium}}
            />
          </RowItemWithLabel>
          <Pressable onPress={onCreate} style={CommonStyles.btnStyle}>
            <Text style={{color: COLORS.white}} textType="subheading">
              {accountDetail.type === 'Edit' ? 'Edit Account' : 'Save Account'}
            </Text>
          </Pressable>
        </BottomSheetScreen>
      </Screen>
    );
  },
);

const styles = StyleSheet.create({
  accountsContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginBottom: SPACING.big,
  },
});

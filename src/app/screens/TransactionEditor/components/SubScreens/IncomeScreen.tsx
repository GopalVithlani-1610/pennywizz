import {
  BottomSheetComponent,
  Pressable,
  PressableIconButton,
  PressableTextButton,
  RowItemWithLabel,
  Text,
  TextInput,
} from '@/src/app/components';
import {COLORS, SPACING} from '@/src/app/theme';
import React, {useRef} from 'react';
import {Payee} from '..';
import {AccountEntity, CategoryEntity} from '@/src/types/domainTypes';
import {subscreenCommonStyles} from './subscreen-common-styles';
import {DateHelper} from '@/src/app/helper';
import {SubScreenProps} from '../../helper';
import BottomSheet from '@gorhom/bottom-sheet';

const IncomeScreen = (props: SubScreenProps) => {
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const accountBottomSheetRef = useRef<BottomSheet>(null);
  const sheetRenderItem = (item: CategoryEntity) => {
    return (
      <Pressable
        style={subscreenCommonStyles.itemStyle}
        animated={false}
        onPress={() => {
          props.setTransactionEntry('category', item);
          // bottomSheetRef.current?.close();
          categoryBottomSheetRef.current?.close();
        }}>
        <Text>{item.emoji} </Text>
        <Text>{item.name}</Text>
      </Pressable>
    );
  };

  const accountRenderItem = (item: AccountEntity) => {
    return (
      <Pressable
        animated={false}
        onPress={() => {
          props.setTransactionEntry('account', item.id);
          accountBottomSheetRef.current?.close();
        }}
        style={subscreenCommonStyles.itemStyle}>
        <Text>{item.name}</Text>
      </Pressable>
    );
  };
  return (
    <>
      <BottomSheetComponent
        ref={categoryBottomSheetRef}
        contentContainerStyle={
          subscreenCommonStyles.bottomSheetContentContainerStyle
        }
        sheetTitle="Choose Category"
        sheetData={props.categories}
        sheetRenderItem={sheetRenderItem}>
        <RowItemWithLabel text={'Category'} pointerEvents="none">
          <PressableIconButton
            onPress={() => {}}
            text={props.transactionEntry.category?.name ?? 'Select Category'}
            iconName="label"
            iconStyle={{color: COLORS.mediumGray}}
          />
        </RowItemWithLabel>
      </BottomSheetComponent>

      <RowItemWithLabel text="Date">
        <PressableIconButton
          // eslint-disable-next-line react-native/no-inline-styles
          iconStyle={{
            color: COLORS.mediumGray,
            size: 14,
          }}
          iconName="calendar"
          text={DateHelper.formateDateByFormat(
            props.transactionEntry.transactionDate,
            DateHelper.DateFormats.UI,
          )}
          onPress={() => {
            props.toggleDatePicker(true);
          }}
          style={subscreenCommonStyles.input}
        />
      </RowItemWithLabel>
      <Payee
        onPayeeSelect={p => {
          props.setTransactionEntry('payee', p.id);
        }}
      />
      <BottomSheetComponent
        ref={accountBottomSheetRef}
        sheetTitle="Choose Account"
        contentContainerStyle={{
          gap: SPACING.sm,
          padding: SPACING.md,
        }}
        sheetData={props.accounts}
        sheetRenderItem={accountRenderItem}>
        <RowItemWithLabel text="From" pointerEvents="none">
          <PressableIconButton
            onPress={() => {}}
            text={
              props.transactionEntry.account
                ? props.accounts.find(
                    account => account.id === props.transactionEntry.account,
                  )?.name
                : 'Select Account'
            }
            iconName="wallet"
            iconStyle={{color: COLORS.mediumGray}}
          />
        </RowItemWithLabel>
      </BottomSheetComponent>

      <RowItemWithLabel text="Remarks">
        <TextInput
          style={subscreenCommonStyles.notesInput}
          placeholder="Add notes"
          value={props.transactionEntry.notes ?? ''}
          multiline
          onChangeText={newRemark =>
            props.setTransactionEntry('notes', newRemark)
          }
        />
      </RowItemWithLabel>
    </>
  );
};

export default IncomeScreen;

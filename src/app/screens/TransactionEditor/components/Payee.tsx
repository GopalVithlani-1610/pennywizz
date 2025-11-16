import {
  CaptionText,
  Portal,
  Pressable,
  RowItemWithLabel,
  Text,
  useToastContext,
} from '@/src/app/components';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {payeeDatabaseInstance} from '@/src/database';
import {useAsyncEffect} from '@/src/app/hooks';
import {PayeeEntity} from '@/src/types/domainTypes';
import {ActivityIndicator, BackHandler} from 'react-native';
import {SearchBar} from '../../Spendings/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import CommonStyles from '@/src/app/styles';
import {StyleSheet} from 'react-native';
import BhIcon from '@/src/app/assets/icons';

type PayeeProps = {
  onPayeeSelect: (p: PayeeEntity) => void;
  selectedPayeeId?: string;
};
export default (props: PayeeProps) => {
  const toast = useToastContext();
  const [showPayeelist, setShowPayeelist] = React.useState(false);
  const [loadingPayee, setLoading] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [payeeListData, setPayeeListData] = useState<PayeeEntity[]>([]);
  const searchedRef = useRef<PayeeEntity[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedPayee, setSelectedPayee] = React.useState<PayeeEntity | null>(
    null,
  );
  useAsyncEffect(async () => {
    const payeeData = await payeeDatabaseInstance().getAllPayee();
    searchedRef.current = payeeData;
    if (props.selectedPayeeId) {
      const payee = payeeData.find(i => i.id === props.selectedPayeeId);
      if (payee) {
        setSelectedPayee(payee);
      }
      setPayeeListData(payeeData.filter(a => !a.isDeleted));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showPayeelist) {
          bottomSheetRef.current?.close();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [showPayeelist]);
  const onSearchValueChange = (d: string) => {
    const searchedData = searchedRef.current.filter(
      i => i.name.toLowerCase().includes(d.toLowerCase()) || d.length === 0,
    );
    setPayeeListData(searchedData);
    setSelectedValue(d);
  };

  const savePayee = async () => {
    const newCreatedPayee = await payeeDatabaseInstance().createPayee({
      name: selectedValue,
    });
    toast?.show('Payee Created Successfully', 'Success');
    const allData = [...searchedRef.current, newCreatedPayee];
    searchedRef.current = allData;
    setPayeeListData(d => {
      d.push(newCreatedPayee);
      return [...d];
    });
  };

  return (
    <>
      <RowItemWithLabel text="Payee">
        <Pressable
          style={CommonStyles.displayRow}
          animated={false}
          onPress={() => setShowPayeelist(!showPayeelist)}>
          <BhIcon
            name="user"
            style={{marginRight: SPACING.sm}}
            color={COLORS.darkPrimary}
          />
          <Text>
            {selectedPayee === null ? 'Select Payee' : selectedPayee.name}
          </Text>
        </Pressable>
      </RowItemWithLabel>
      {showPayeelist && (
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            style={styles.bottomSheetContainer}
            onClose={() => setShowPayeelist(false)}
            backdropComponent={BottomSheetBackdrop}
            enablePanDownToClose
            snapPoints={['80%']}>
            <Text style={[CommonStyles.subheadingTitle, {marginHorizontal: 0}]}>
              Select Payee
            </Text>
            <SearchBar onValueChange={onSearchValueChange} />
            <CaptionText>
              Start typing to search.If it's not in the list,we'll help you add
              it.
            </CaptionText>
            {payeeListData.length === 0 && selectedValue.length > 0 && (
              <Pressable onPress={savePayee} style={styles.createNewPayeeBtn}>
                <Text textType="subheading" style={{color: COLORS.secondry}}>
                  create: {selectedValue}
                </Text>
              </Pressable>
            )}
            {!loadingPayee ? (
              <BottomSheetFlatList
                data={payeeListData}
                keyExtractor={i => i.id}
                contentContainerStyle={{
                  gap: SPACING.sm,
                  paddingVertical: SPACING.big,
                }}
                renderItem={({item}) => {
                  return (
                    <Pressable
                      onPress={() => {
                        bottomSheetRef.current?.close();
                        setSelectedPayee(item);
                        props.onPayeeSelect(item);
                      }}
                      style={styles.itemStyle}>
                      <Text>{item.name}</Text>
                    </Pressable>
                  );
                }}
              />
            ) : (
              <ActivityIndicator />
            )}
          </BottomSheet>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingHorizontal: SPACING.md,
    ...CommonStyles.ctaShadow,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  createNewPayeeBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderColor: COLORS.lightGray,
    marginVertical: SPACING.big,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyle: {
    height: 40,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
  },
});

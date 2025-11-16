import BhIcon from '@/src/app/assets';
import {
  DashedButton,
  Pressable,
  Text,
  TextInput,
  useToastContext,
} from '@/src/app/components';
import {withGetEffect} from '@/src/app/hof';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import Utils from '@/src/app/utils';
import {payeeDatabaseInstance} from '@/src/database';
import {PayeeEntity} from '@/src/types/domainTypes';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Modal, Keyboard} from 'react-native';

export default withGetEffect(
  () => payeeDatabaseInstance().getAllPayee(),
  props => {
    const [payeeList, setPayeeList] = useState(
      props.data.filter(a => !a.isDeleted),
    );

    useEffect(() => {
      setPayeeList(props.data.filter(a => !a.isDeleted));
    }, [props.data]);
    const NEW_ID = 'NEW';
    const [editedPayee, setEditedPayee] = useState<PayeeEntity | null>(null);
    const toast = useToastContext();
    const deletePayee = (payeeId: string) => {
      Utils.makeAlert(
        'Delete',
        'Are you sure you want to delete?',
        async () => {
          try {
            await payeeDatabaseInstance().deletePayee(payeeId);
            toast.show('Payee deleted successfully!', 'Success');
            setPayeeList(_payeeList => {
              return payeeList.filter(a => a.id !== payeeId);
            });
          } catch (e: any) {
            toast.show(e.message, 'Error');
          }
        },
        true,
      );
    };
    const onSavePress = async () => {
      Keyboard.dismiss();
      if (editedPayee!.id === NEW_ID) {
        const payee = await payeeDatabaseInstance().createPayee({
          name: editedPayee!.name,
        });
        toast.show('Payee created successfully!', 'Success');
        setPayeeList(prevPayeeList => [...prevPayeeList, payee]);
      } else {
        await payeeDatabaseInstance().update(editedPayee!);
        toast.show('Payee updated successfully!', 'Success');
        setPayeeList(prevPayeeList =>
          prevPayeeList.map(payee =>
            payee.id === editedPayee!.id ? editedPayee! : payee,
          ),
        );
      }
      toggleShowBottomSheet();
      props.query();
    };
    const toggleShowBottomSheet = (payee: PayeeEntity | null = null) => {
      setEditedPayee(payee);
    };
    const renderItem = ({item}: {item: PayeeEntity}) => {
      return (
        <Pressable
          onPress={() => toggleShowBottomSheet(item)}
          style={styles.listItemContainer}>
          <Text>{item.name}</Text>
          <Pressable onPress={() => deletePayee(item.id)}>
            <BhIcon name="trash" size={18} color={COLORS.red} />
          </Pressable>
        </Pressable>
      );
    };
    return (
      <>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: SPACING.md,
            gap: SPACING.sm,
            paddingVertical: SPACING.big,
          }}
          ListHeaderComponent={
            <DashedButton
              text="Create Payee"
              onPress={() => toggleShowBottomSheet({id: NEW_ID, name: ''})}
            />
          }
          data={payeeList}
          renderItem={renderItem}
          keyExtractor={e => e.id}
        />
        {editedPayee && (
          <Modal
            animationType="fade"
            visible
            // transparent
            presentationStyle="formSheet">
            <View style={styles.modalWrapper}>
              <View style={styles.modalItemContainer}>
                <Text
                  textType="normal"
                  style={{fontSize: 14, marginBottom: SPACING.big}}>
                  {editedPayee.id === NEW_ID ? 'Create' : 'Edit'} Payee
                </Text>
                <TextInput
                  placeholder="hello?"
                  style={styles.modalInputStyle}
                  onChangeText={e =>
                    setEditedPayee({
                      ...editedPayee,
                      name: e,
                    })
                  }
                  value={editedPayee.name}
                />
                <View style={styles.modalActionContainer}>
                  <Pressable
                    style={styles.modalActionBtn}
                    onPress={toggleShowBottomSheet}>
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalActionBtn}
                    onPress={onSavePress}>
                    <Text>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  listItemContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.custom(1.5),
    borderRadius: SPACING.sm,
    borderColor: COLORS.lightGray,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalInputStyle: {
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    borderColor: COLORS.darkPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    color: COLORS.subHeadingText,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
  },
  modalWrapper: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  modalItemContainer: {
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.darkPrimary,
    padding: SPACING.big,
    borderRadius: SPACING.md,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: BORDER_RADIUS.md,
  },
  modalActionBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

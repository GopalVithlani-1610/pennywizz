import React, {useState} from 'react';
import {Loader, Screen} from '@/app/components';
import {
  payeeDatabaseInstance,
  transactionCategoryLinked,
  transactionDatabaseInstance,
} from '@/src/database';
import {useAsyncEffect} from '@/app/hooks';
import {useRecoilValue} from 'recoil';
import {categoriesState} from '@/app/state';
import {
  PayeeEntity,
  TransactionCategoriesLinkEntity,
  TransactionCategoriesPayeeLinkEntity,
} from '@/src/types/domainTypes';
import {TransactionCard} from '../../components/atoms';
import {View} from 'react-native';
import {ScrollView} from 'react-native';
import {SPACING} from '../../theme';
import {transactionCategoryLinkPayeeLinked} from '@/src/database/utils';

type ScreenProps = {
  accountId: string;
};
export default (props: ScreenProps) => {
  const [loadingState, setLoadingState] = useState(true);
  const [transactionsState, setTransactionsState] = useState<
    TransactionCategoriesPayeeLinkEntity[]
  >([]);
  const categories = useRecoilValue(categoriesState);

  useAsyncEffect(async () => {
    const transactions =
      await transactionDatabaseInstance().getAllTransactionsByAccountId(
        'N2pHkTkj21oG5bt4',
      );
    const payeeList = await payeeDatabaseInstance().getPayeeByIdList(
      transactions.filter(a => a.payee).map(a => a.payee!),
    );
    const withCategories = transactionCategoryLinkPayeeLinked(
      transactionCategoryLinked(transactions, categories),
      payeeList,
    );
    setLoadingState(false);
    setTransactionsState(withCategories);
  }, []);

  if (loadingState) {
    return <Loader show text="loading transactions..." />;
  }
  return (
    <Screen>
      <ScrollView contentContainerStyle={{gap: SPACING.sm}}>
        {transactionsState.map(transaction => {
          return (
            <TransactionCard transaction={transaction}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TransactionCard.Category />
                <TransactionCard.Amount />
              </View>
              <TransactionCard.Date />
              <TransactionCard.Notes />
              <TransactionCard.Payee />
            </TransactionCard>
          );
        })}
      </ScrollView>
    </Screen>
  );
};

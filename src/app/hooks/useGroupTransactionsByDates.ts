import {DateHelper} from '../helper';

export default function useGroupTransactionsByDate<
  T extends {transactionDate: Date},
>(transactions: T[]) {
  const getDateOnly = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const today = DateHelper.todayDate();
  const yesterday = DateHelper.subtract(today, 1);

  let groupedData: {
    title: string;
    data: T[];
    _day: number;
  }[] = [];

  for (let i = 0; i < transactions.length; i++) {
    const transactionDate = transactions[i].transactionDate;
    const dayOfTransaction = transactionDate.getDate();
    const bucket = groupedData.find(d => d._day === dayOfTransaction);
    if (bucket) {
      bucket.data.push(transactions[i]);
    } else {
      groupedData.push({
        title:
          dayOfTransaction === today.getDate()
            ? 'Today'
            : dayOfTransaction === yesterday.getDate()
            ? 'Yesterday'
            : getDateOnly(transactionDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
        data: [transactions[i]],
        _day: dayOfTransaction,
      });
    }
  }
  return groupedData.sort((a, b) => b._day - a._day);
}

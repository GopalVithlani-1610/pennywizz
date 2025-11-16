import {
  writeFile,
  mkdir,
  exists,
  DocumentDirectoryPath,
  DownloadDirectoryPath,
} from 'react-native-fs';
import {TransactionCategoriesPayeeLinkEntity} from '@/src/types/domainTypes';
import DateHelper from './date';
import {Platform} from 'react-native';
import {name} from '@/app.json';
const getFilePath = (dir: string, fileName: string) => {
  return dir + `/${fileName}.csv`;
};

const createName = () => {
  return `Expenses_${new Date().toDateString()}_${Math.random()
    .toString(16)
    .substring(2)}`;
};

const getCsvHeaders = () => 'Date,Category,Payee,Amount,Remark';

const createFolder = async () => {
  const dir = Platform.select({
    ios: `${DocumentDirectoryPath}/${name}/exports`,
    android: `${DownloadDirectoryPath}/${name}/exports`,
  })!;
  try {
    if (await exists(dir)) {
      return dir;
    }
    await mkdir(dir);
  } catch {}
  return dir;
};

export default async (transactions: TransactionCategoriesPayeeLinkEntity[]) => {
  const dir = await createFolder();
  const fileName = createName();
  let headers = getCsvHeaders(),
    body = transactions
      .map(
        transaction =>
          `${DateHelper.formateDateByFormat(
            transaction.transactionDate,
            DateHelper.DateFormats.DEFAULT,
          )},${transaction.category.name.replace(/,/g, ' ')},${
            transaction.payee?.name.replace(/,/g, ' ') ?? ''
          },${transaction.amount},${
            transaction.notes?.replace(/,/g, ' ') ?? ''
          }\n`,
      )
      .join('');
  const csv = `${headers}\n${body}`;
  return writeFile(getFilePath(dir, fileName), csv);
};

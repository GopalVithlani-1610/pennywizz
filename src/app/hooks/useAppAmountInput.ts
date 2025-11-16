import {useRef, useState} from 'react';

function useAmountFormmaterForInput(value: number) {
  const valueToString = String(value ?? 0);
  const _initialAmount = !valueToString.includes('.')
    ? valueToString.padEnd(valueToString.length + 2, '0')
    : (valueToString.length - (valueToString.indexOf('.') + 1) === 1
        ? valueToString + '0'
        : valueToString
      ).replace('.', '');
  return _initialAmount;
}
/**
 * @description This will skips the (.) and it will behave that decimal never exists. it will just do `[Amount]/100`
 * @param initialValue Initial Amount
 * @returns object that contains the updater functions for updating the amount
 */
export default function useAppAmountInput(initialValue: number = 0) {
  const formatedValue = useAmountFormmaterForInput(
    parseFloat(initialValue.toFixed(2)),
  );
  const [_amount, _setAmount] = useState(formatedValue);
  const isbackspaceUpdated = useRef(false);
  const update = (e: string) => {
    if (isbackspaceUpdated.current) {
      let _newAmount = _amount.substring(0, _amount.length - 1);
      isbackspaceUpdated.current = false;
      if (isNaN(Number(_newAmount))) {
        _newAmount = '0'; // handling minus sign
      }
      _setAmount(_newAmount);
      return;
    }
    if (/\d/.test(e[e.length - 1])) {
      _setAmount(_amount + e[e.length - 1]);
    }
  };
  const onBackspace = () => (isbackspaceUpdated.current = true);
  const readInCurrency = () => getNumberedValue().formatIntoCurrency();

  const getNumberedValue = () => Number(_amount) / 100;
  return {update, readInCurrency, getNumberedValue, onBackspace};
}

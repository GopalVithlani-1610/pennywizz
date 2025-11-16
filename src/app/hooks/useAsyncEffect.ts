import {useEffect} from 'react';

export default function useAsyncEffect(fn: () => void, deps: any[] = []) {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

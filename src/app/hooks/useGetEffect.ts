import {useFocusEffect} from '@react-navigation/native';
import {captureException} from '@sentry/react-native';
import {useCallback, useState} from 'react';

type args<T> = () => Promise<T[]>;

type StateType<T> = {
  loading: boolean;
  error: string;
  data: null | T[];
};
export default function useGetEffect<T extends {}>(dataGetLoaderFn: args<T>) {
  const [dataLoaded, setDataLoaded] = useState<StateType<T>>({
    loading: true,
    error: '',
    data: null,
  });
  const query = useCallback(() => {
    setDataLoaded({
      ...dataLoaded,
      loading: true,
    });
    (async () => {
      try {
        const queryResponse = await dataGetLoaderFn();
        setDataLoaded({loading: false, data: queryResponse ?? [], error: ''});
      } catch (e: any) {
        captureException(e, {
          data: {
            fn: 'query_geteffect',
            args: dataGetLoaderFn.name.toString(),
          },
        });

        setDataLoaded({loading: false, data: null, error: e.message});
      }
    })();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   query();
  // }, [query]);

  useFocusEffect(
    useCallback(() => {
      query();
    }, [query]),
  );

  return {
    ...dataLoaded,
    query,
  };
}

import React from 'react';
import {useGetEffect} from '../hooks';
import {Loader} from '../components';
import {View} from 'react-native';

// Props: Woh + New

type args<T> = () => Promise<T[]>;
export type IWithGetEffect<T, J = {}> = J & {
  data: T[];
  query: () => void;
  error: string;
  loading: boolean;
};

export const withGetEffect = <T extends {}, J = {}>(
  arg: args<T>,
  Component: (props: IWithGetEffect<T, J>) => React.ReactNode,
) => {
  return (props: J) => {
    const {loading, data, query, error} = useGetEffect(arg);

    return (
      <>
        <View style={{flex: 1}}>
          <Component
            {...props}
            error={error}
            data={data || []}
            query={query}
            loading={loading}
          />
          {loading && <Loader show />}
        </View>
      </>
    );
  };
};

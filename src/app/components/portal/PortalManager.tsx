import React from 'react';
import {View, StyleSheet} from 'react-native';

export default class PortalManager extends React.PureComponent<
  {},
  {
    portals: {
      key: number;
      children: React.ReactNode;
    }[];
  }
> {
  state: {
    portals: {
      key: number;
      children: React.ReactNode;
    }[];
  } = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode) => {
    this.setState(r => {
      return {
        portals: [...r.portals, {key, children}],
      };
    });
  };
  unmount = (key: number) => {
    this.setState(r => {
      const filtered = r.portals.filter(i => i.key !== key);
      return {
        portals: filtered,
      };
    });
  };

  update = (key: number, children: React.ReactNode) => {
    this.setState(r => ({
      portals: r.portals.map(portal => {
        if (portal.key == key) {
          return {...portal, children};
        }
        return portal;
      }),
    }));
  };

  render() {
    return (
      <>
        {this.state.portals.map(portal => {
          return (
            <View
              pointerEvents="box-none"
              key={portal.key.toString()}
              style={[StyleSheet.absoluteFillObject, {zIndex: 20}]}>
              {portal.children}
            </View>
          );
        })}
      </>
    );
  }
}

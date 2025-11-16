import React from 'react';
import PortalManager from './PortalManager';

export const PortalContext = React.createContext<{
  mount(_children: React.ReactNode): number;
  unmount(_key: number): void;
  update(_key: number, children: React.ReactNode): void;
} | null>(null);

let key = 0;

export default ({children}: {children: React.ReactNode}) => {
  const managerRef = React.useRef<PortalManager>();
  const mount = (_children: React.ReactNode): number => {
    key++;
    managerRef.current?.mount(key, _children);
    return key;
  };

  const unmount = (_key: number) => {
    managerRef.current?.unmount(key);
  };

  const update = (_key: number, c: React.ReactNode) => {
    managerRef.current?.update(key, c);
  };

  const setManager = (manager: PortalManager) => {
    managerRef.current = manager;
  };

  return (
    <PortalContext.Provider value={{mount, unmount, update}}>
      {children}
      <PortalManager ref={setManager} />
    </PortalContext.Provider>
  );
};

import React from 'react';
import {PortalContext} from './PortalProvider';

export default ({children}: {children: React.JSX.Element}) => {
  const portalProvider = React.useContext(PortalContext);
  const key = React.useRef<number | undefined>(-1);
  React.useEffect(() => {
    key.current = portalProvider?.mount(children);

    return () => {
      portalProvider?.unmount(key.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!key.current) return;
    portalProvider?.update(key.current, children);
  }, [children, portalProvider]);
  return null;
};

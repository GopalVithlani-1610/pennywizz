import {useRef} from 'react';

const _resetDoubleTapThreshold = 300;

/**
 * @param cb Callback to be called on double tap.
 * @returns functions that accepts the cb that will to be called on the double tap. Threshold `300 ms`
 */

export default function useDoubleTap(diffTimeout?: number) {
  const _diffTimeout = diffTimeout ?? _resetDoubleTapThreshold;
  const lastTap = useRef(0);
  const doubleTapTimeout = useRef<NodeJS.Timeout>();
  const handleDoubleTap = (cb: () => boolean, singleTab?: () => boolean) => {
    const now = Date.now();
    if (lastTap.current !== null && now - lastTap.current < _diffTimeout) {
      clearTimeout(doubleTapTimeout.current);
      return cb();
    } else {
      lastTap.current = Date.now();
      doubleTapTimeout.current = setTimeout(() => {
        lastTap.current = 0; // Reset lastTap after delay
      }, _diffTimeout);
      return singleTab?.();
    }
  };
  return handleDoubleTap;
}

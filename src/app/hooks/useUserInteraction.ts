import {useState} from 'react';
import UserInteraction from '../services/UserInteraction';
import useAsyncEffect from './useAsyncEffect';

export default function useUserInteraction() {
  const [userInteraction, setUserInteraction] = useState<{
    greet: string;
    userName: string;
  } | null>(null);

  useAsyncEffect(async () => {
    setUserInteraction(await UserInteraction.getUserGreet());
  }, []);

  return userInteraction;
}

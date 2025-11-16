import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS} from '@/app/theme';
import Animated, {FadeIn} from 'react-native-reanimated';
import BhIcon from '@/app/assets';
import Pressable from './Pressable';

type Props = {
  onChange: (e: boolean) => void;
  value?: boolean;
};

const _size = 25;
export default (props: Props) => {
  const [isChecked, setIsChecked] = useState(props.value ?? false);
  const animation = FadeIn.springify().stiffness(200).damping(80);

  useEffect(() => {
    if (typeof props.value === 'undefined') {
      return;
    }
    setIsChecked(props.value);
  }, [props.value]);
  return (
    <Pressable
      onPress={() => {
        setIsChecked(!isChecked);
        props.onChange(!isChecked);
      }}
      style={styles.container}>
      {isChecked && (
        <Animated.View entering={animation}>
          <BhIcon name="check" />
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.sm,
    width: _size,
    height: _size,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

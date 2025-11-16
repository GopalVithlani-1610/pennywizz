import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {UtilTypes} from '@/src/types';
import {Text, Pressable} from '../atoms';
import CommonStyles from '@/app/styles';

type PressableButtonType = {
  onPress: () => void;
  text: string;
  style?: ViewStyle | ViewStyle[];
  textType?: UtilTypes.TTextType;
  textStyle?: TextStyle;
  disabled?: boolean;
};

class PresableButton extends React.PureComponent<PressableButtonType> {
  constructor(props: PressableButtonType) {
    super(props);
  }
  render() {
    const {props} = this;
    return (
      <Pressable
        animated={false}
        disabled={props.disabled}
        style={props.style}
        ripple={CommonStyles.btnRipple}
        onPress={props.onPress}>
        <Text style={props.textStyle} textType={props.textType}>
          {props.text}
        </Text>
      </Pressable>
    );
  }
}
// const PresableButton = (props: PressableButtonType) => {
//   return (

//   );
// };
export default PresableButton;

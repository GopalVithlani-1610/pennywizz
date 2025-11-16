import React from 'react';
import Svg, {Defs, Path, Pattern, Rect} from 'react-native-svg';
import {COLORS} from '@/app/theme';

type Props = {
  width: number;
  color?: string;
};
const SwirlyLines = ({width, color = COLORS.lightGray}: Props) => {
  return (
    <Svg width={width} height="15" color={color} viewBox={`0 0 ${width} 8`}>
      <Defs>
        <Pattern
          id="line-3420"
          x="0"
          y="0"
          width="15"
          height="8"
          patternUnits="userSpaceOnUse">
          <Path
            d="M15 5.9c-3.8 0-3.8-4.4-7.5-4.4S3.7 5.9 0 5.9"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="3"
          />
        </Pattern>
      </Defs>
      <Rect width={width} height="8" fill="url(#line-3420)" />
    </Svg>
  );
};

export default SwirlyLines;

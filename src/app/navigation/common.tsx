import React from 'react';
import {Header} from '../components';
import {COLORS} from '../theme';

type HeaderSubScreenTitleProps = {
  title: string;
};
export const HeaderSubScreenTitle = (props: HeaderSubScreenTitleProps) => {
  return (
    <Header
      style={{left: -18, top: 0, zIndex: 0}}
      headerTitle={props.title}
      textType="subheading"
      textStyle={{fontSize: 20, lineHeight: 23, color: COLORS.subHeadingText}}
    />
  );
};

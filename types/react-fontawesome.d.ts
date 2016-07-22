import * as React from 'react';

declare class ReactFontAwesome extends React.Component<ReactFontAwesomeProps, any> {}

interface ReactFontAwesomeProps {
  border?: boolean;
  className?: string;
  fixedWidth?: boolean;
  flip?: 'horizontal' | 'vertical';
  inverse?: boolean;
  name: string;
  pulse?: boolean;
  rotate?: number;
  size?: 'lg' | '2x' | '3x' | '4x' | '5x';
  spin?: boolean;
  stack?: '1x' | '2x';
}

declare var ReactFontAwesomeType: typeof ReactFontAwesome;
export = ReactFontAwesomeType;

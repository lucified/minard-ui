import * as React from 'react';

declare namespace ReactFontAwesome {
  export class ReactFontAwesome extends React.Component<ReactFontAwesomeProps, any> {}

  export interface ReactFontAwesomeProps {
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
}

declare var ReactFontAwesomeType: typeof ReactFontAwesome.ReactFontAwesome;
declare module 'react-fontawesome' {
  export = ReactFontAwesomeType;
}

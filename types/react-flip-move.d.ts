import * as React from 'react';

declare class FlipMove extends React.Component<FlipMoveProps, any> {}

interface FlipMoveProps {
  easing?: string;
  duration?: string | number;
  delay?: string | number;
  staggerDurationBy?: string | number;
  staggerDelayBy?: string | number;
  onStart?: any;
  onFinish?: any;
  onStartAll?: any;
  onFinishAll?: any;
  typeName?: string;
  disableAllAnimations?: boolean;
  enterAnimation?: string | boolean | Object;
  leaveAnimation?: string | boolean | Object;
  getPosition?: any;
  className?: string;
}

declare var FlipMoveType: typeof FlipMove;
export = FlipMoveType;

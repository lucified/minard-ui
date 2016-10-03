import * as React from 'react';

declare class ReactGravatar extends React.Component<ReactGravatarProps, any> {}

interface ReactGravatarProps {
  email: string;
  size?: number;
  rating?: "g" | "pg" | "r" | "x"
  default?: string;
  className?: string;
}

declare var ReactGravatarType: typeof ReactGravatar;
export = ReactGravatarType;

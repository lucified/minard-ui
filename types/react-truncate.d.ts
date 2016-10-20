import * as React from 'react';

declare class ReactTruncate extends React.Component<ReactTruncateProps, any> {}

interface ReactTruncateProps {
  lines?: number;
  ellipsis?: string | React.ReactNode,
  onTruncate?: (truncated: boolean) => void;
}

declare var ReactTruncateType: typeof ReactTruncate;
export = ReactTruncateType;

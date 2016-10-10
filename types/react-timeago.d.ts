import * as React from 'react';

declare class ReactTimeAgo extends React.Component<ReactTimeAgoProps, any> {}

type Unit = 'second'
          | 'minute'
          | 'hour'
          | 'day'
          | 'week'
          | 'month'
          | 'year'
type Suffix = 'ago' | 'from now'
type Formatter = (value: number, unit: Unit, suffix: Suffix, epochSeconds: number) => string | React.ReactElement<Object>

interface ReactTimeAgoProps {
  live?: boolean;
  /** minimum amount of time in seceonds between re-renders */
  minPeriod?: number;
  /** Maximum time between re-renders in seconds. The component should update at least once every `x` seconds */
  maxPeriod?: number;
  /** The container to render the string into. You could use a string like `span` or a custom component */
  component?: string | React.ComponentClass<any>;
  /**
   * A title used for setting the title attribute if a <time> HTML Element is used.
   */
  title?: string;
  /** A function to decide how to format the date.
   * If you use this, react-timeago is basically acting like a glorified setInterval for you.
   */
  formatter?: Formatter;
  /** The Date to display. An actual Date object or something that can be fed to new Date */
  date: string | number | Date;
}

declare var ReactTimeAgoType: typeof ReactTimeAgo;
export default ReactTimeAgoType;

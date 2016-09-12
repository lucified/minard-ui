import * as React from 'react';

declare class ReactWaypoint extends React.Component<ReactWaypointProps, any> {}

interface WaypointEvent {
  currentPosition: string;
  previousPosition: string;
  event: any;
  waypointTop: number;
  viewportTop: number;
  viewportBottom: number;
}

interface ReactWaypointProps {
  /**
   * Function called when waypoint enters viewport
   */
  onEnter?: (e: WaypointEvent) => void;

  /**
   * Function called when waypoint leaves viewport
   */
  onLeave?: (e: WaypointEvent) => void;

  /**
   * Function called when waypoint position changes
   */
  onPositionChange?: (e: WaypointEvent) => void;

  /**
   * `topOffset` can either be a number, in which case its a distance from the
   * top of the container in pixels, or a string value. Valid string values are
   * of the form "20px", which is parsed as pixels, or "20%", which is parsed
   * as a percentage of the height of the containing element.
   * For instance, if you pass "-20%", and the containing element is 100px tall,
   * then the waypoint will be triggered when it has been scrolled 20px beyond
   * the top of the containing element.
   */
  topOffset?: number | string;

  /**
   * `bottomOffset` is like `topOffset`, but for the bottom of the container.
   */
  bottomOffset?: number | string;

  /**
   * Scrollable Ancestor - A custom ancestor to determine if the
   * target is visible in it. This is useful in cases where
   * you do not want the immediate scrollable ancestor to be
   * the container. For example, when your target is in a div
   * that has overflow auto but you are detecting onEnter based
   * on the window.
   */
  scrollableAncestor?: any;

  /**
   * fireOnRapidScroll - if the onEnter/onLeave events are to be fired
   * on rapid scrolling. This has no effect on onPositionChange -- it will
   * fire anyway.
   */
  fireOnRapidScroll?: boolean;

  /**
   * Use this prop to get debug information in the console log. This slows
   * things down significantly, so it should only be used during development.
   */
  debug?: boolean;

  /**
   * The `throttleHandler` prop provides a function that throttle the internal
   * scroll handler to increase performance.
   * The argument passed in to the throttle handler function, scrollHandler,
   * is waypoint's internal scroll handler. The throttleHandler is only invoked
   * once during the lifetime of a waypoint (when the waypoint is mounted).
   * To prevent errors coming from the fact that the scroll handler can be
   * called after the waypoint is unmounted, it's a good idea to cancel the
   * throttle function on unmount.
   */
  throttleHandler?: (throttleHandler: any) => any;
}

declare var ReactWaypointType: typeof ReactWaypoint;
export = ReactWaypointType;

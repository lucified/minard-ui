import * as React from 'react';

interface ReactAutosizeTextareaProps extends HTMLTextAreaElement {
  onResize?: (e: Event) => void;
  // rows?: number;
  maxRows?: number;
  innerRef?: (ref: HTMLElement) => void;
}

declare class ReactAutosizeTextarea extends React.Component<ReactAutosizeTextareaProps, any> {}

export default ReactAutosizeTextarea;

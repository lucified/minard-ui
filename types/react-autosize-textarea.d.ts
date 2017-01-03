import * as React from 'react';

declare class ReactAutosizeTextarea extends React.Component<ReactAutosizeTextareaProps, any> {}

interface ReactAutosizeTextareaProps extends HTMLTextAreaElement {}

declare var ReactAutosizeTextareaType: typeof ReactAutosizeTextarea;
export = ReactAutosizeTextareaType;

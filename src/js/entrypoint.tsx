import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Hello from './components/hello-world.tsx';
import props from './utils';

ReactDOM.render(
    <Hello name={props.name}/>,
    document.getElementById('content')
);

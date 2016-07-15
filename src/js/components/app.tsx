import * as React from 'react';

// require global styles
import '../../scss/styles.scss';

// require style for component used with css modules
// https://github.com/css-modules/css-modules
// https://github.com/TypeStrong/ts-loader#loading-other-resources-and-code-splitting
const styles: any = require('../../scss/app.scss');

interface IProps {}

export default (props: IProps) => (
  <div className="empty">
    <p className="empty-title">Let's start building this</p>
    <p className="empty-meta">Now our CSS framework works.</p>
    <button className="empty-action btn btn-primary">Let's do it!</button>
  </div>
);

import {IProps} from '../utils';
import * as React from 'react';

// require global styles
import '../../scss/styles.scss';


// require style for component used with css modules
// https://github.com/css-modules/css-modules
// https://github.com/TypeStrong/ts-loader#loading-other-resources-and-code-splitting
const styles: any = require('../../scss/hello-world.scss');
// require an image
const camelImageUrl: any = require('../../images/camel.jpg');



export default (props: IProps) => (

  <div className={styles['hello-world']}>
      <h3>{`Hello ${props.name}!`}</h3>
      <p>Below is an image of a camel:</p>
      <img src={camelImageUrl} style={{width: 500}} />
  </div>

);

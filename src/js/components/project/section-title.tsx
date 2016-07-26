import * as React from 'react';

const styles = require('../../../scss/section-title.scss');

const SectionTitle = ({children}: {children?: any}) => (
  <div className="columns">
    <div className="column col-12">
      <h5 className={styles.title}>{children}</h5>
    </div>
  </div>
);

export default SectionTitle;

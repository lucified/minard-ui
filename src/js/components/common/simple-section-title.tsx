import * as React from 'react';

const styles = require('./simple-section-title.scss');

// NOTE: Each of these are expected to have one root element.
// CSS classes will be added to this element.
interface Props {
  children?: any;
}

const SimpleSectionTitle = ({ children }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.primary}>
        {children}
      </div>
      <hr className={styles.line} />
    </div>
  );
};

export default SimpleSectionTitle;

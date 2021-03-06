import * as React from 'react';

const styles = require('./simple-section-title.scss');

interface Props {
  children?: any;
  rightContent?: string | JSX.Element;
}

const SimpleSectionTitle = ({ children, rightContent }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.primary}>
        {children}
      </div>
      {rightContent &&
        <div>
          {rightContent}
        </div>}
    </div>
  );
};

export default SimpleSectionTitle;

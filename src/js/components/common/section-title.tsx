import * as classNames from 'classnames';
import * as React from 'react';

const styles = require('./section-title.scss');

// NOTE: Each of these are expected to have one root element.
// CSS classes will be added to this element.
interface Props {
  children?: any;
  rightContent?: any;
  leftContent?: any;
}

const SectionTitle = ({ children, leftContent, rightContent }: Props) => {
  let leftContentWithBackgroundColor: any;
  if (leftContent) {
    leftContentWithBackgroundColor = React.cloneElement(leftContent, {
      className: classNames(
        leftContent.props.className,
        styles['background-color'],
        styles['padding-right'],
      ),
    });
  }

  let childrenWithBackgroundColor: any;
  if (React.Children.count(children) === 1) {
    childrenWithBackgroundColor = React.Children.only(children);
    childrenWithBackgroundColor = React.cloneElement(childrenWithBackgroundColor, {
      className: classNames(
        childrenWithBackgroundColor.props.className,
        styles['background-color'],
        styles['padding-left'],
        styles['padding-right'],
      ),
    });
  } else {
    console.log('Error: Only one child expected in SectionTitle!');
  }

  let rightContentWithBackgroundColor: any;
  if (rightContent) {
    rightContentWithBackgroundColor = React.cloneElement(rightContent, {
      className: classNames(
        rightContent.props.className,
        styles['background-color'],
        styles['padding-left'],
      ),
    });
  }

  return (
    <section>
      <hr className={styles.line} />
      <div className={classNames(styles['section-title'], 'row', 'middle-xs', 'between-xs')}>
        <div className={classNames(styles.left, 'col-xs-6', 'col-sm-3', 'first-sm')}>
          { leftContentWithBackgroundColor }
        </div>
        <div className={classNames(styles.title, 'col-xs-12', 'col-sm-6', 'first-xs')}>
          { childrenWithBackgroundColor }
        </div>
        <div className={classNames(styles.right, 'col-xs-6', 'col-sm-3')}>
          { rightContentWithBackgroundColor }
        </div>
      </div>
    </section>
  );
};

export default SectionTitle;

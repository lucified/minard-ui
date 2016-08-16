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

  let childrenWithBackgroundColor: React.ReactElement<any>;
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
    <section className="container grid-1200">
      <hr className={styles.line} />
      <div className={classNames(styles['section-title'], 'columns', 'col-gapless')}>
        <div className={classNames(styles.left, 'column', 'col-3')}>
          { leftContentWithBackgroundColor }
        </div>
        <div className={classNames(styles.title, 'column', 'col-6')}>
          { childrenWithBackgroundColor }
        </div>
        <div className={classNames(styles.right, 'column', 'col-3')}>
          { rightContentWithBackgroundColor }
        </div>
      </div>
    </section>
  );
};

export default SectionTitle;

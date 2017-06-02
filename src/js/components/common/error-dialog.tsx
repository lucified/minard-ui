import * as React from 'react';

const styles = require('./error-dialog.scss');

interface Props {
  title?: string;
  actionText?: string;
  action?: () => void;
}

export default class ErrorDialog extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  public render() {
    const { title, actionText, action } = this.props;

    const getTitle = () => {
      if (title) {
        return <h4 className={styles.header}>{title}</h4>;
      }
      return undefined;
    };

    const getAction = () => {
      if (action && actionText) {
        return (
          <div className={styles['button-container']}>
            <button onClick={this.handleButtonClick}>{actionText}</button>
          </div>
        );
      }
      return undefined;
    };

    return (
      <div className={styles.dialog}>
        {getTitle()}
        <div className={styles.content}>
          {this.props.children}
        </div>
        {getAction()}
      </div>
    );
  }

  private handleButtonClick() {
    const { action } = this.props;

    if (action) {
      action();
    }
  }
}

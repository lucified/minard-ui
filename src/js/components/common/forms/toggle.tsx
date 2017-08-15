import * as React from 'react';
import Toggle from 'react-toggle';

import 'react-toggle/style.css';

const styles = require('./toggle.scss');

interface Props {
  label: string;
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

class Field extends React.Component<Props> {
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.checked);
  };

  public render() {
    const { label, text, checked, disabled } = this.props;
    return (
      <div className={styles.field}>
        <div>
          <label className={styles.label}>
            {label}
          </label>
        </div>
        <div className={styles.content}>
          <div>
            {text}
          </div>
          <div className={styles['checkbox-container']}>
            <Toggle
              checked={checked}
              onChange={this.handleChange}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Field;

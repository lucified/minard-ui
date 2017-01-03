import * as classNames from 'classnames';
import * as React from 'react';
import * as Textarea from 'react-autosize-textarea';
import * as Icon from 'react-fontawesome';
import { BaseFieldProps } from 'redux-form';

const styles = require('./field.scss');

interface PassedProps {
  instructions: string;
}

const Field = ({
  instructions,
  input,
  name,
  label,
  placeholder,
  type,
  meta: {
    dirty,
    error,
    touched,
  },
}: BaseFieldProps & PassedProps) => {
  const inputComponent = type === 'textarea' ?
    <Textarea {...input} placeholder={placeholder} type={type} /> :
    <input {...input} placeholder={placeholder} type={type} />;

  return (
    <div className={styles.field}>
      <div>
        <label className={styles.label} htmlFor={name}>{label}</label>
        {(dirty || touched) && error && <span className={styles.error}>{error}</span>}
      </div>
      <div className={styles.input}>
        <Icon name="pencil" className={classNames(styles.icon, styles[type])} />
        {inputComponent}
      </div>
      {instructions && <div className={styles.instructions}>{instructions}</div>}
    </div>
  );
};

export default Field;

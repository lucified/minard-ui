import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import { BaseFieldProps } from 'redux-form';

const styles = require('./comment-field.scss');

const Field = ({
  input,
  placeholder,
  type,
  meta: {
    error,
    touched,
  },
}: BaseFieldProps) => {
  const inputComponent = type === 'textarea' ?
    <Textarea {...input} placeholder={placeholder} type={type} rows={3} /> :
    <input {...input} placeholder={placeholder} type={type} />;

  return (
    <div className={styles.field}>
      <div>
        {touched && error && <span className={styles.error}>{error}</span>}
      </div>
      {inputComponent}
    </div>
  );
};

export default Field;

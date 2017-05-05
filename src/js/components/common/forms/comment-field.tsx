import * as React from 'react';
import * as Textarea from 'react-autosize-textarea';
import { BaseFieldProps, WrappedFieldMetaProps } from 'redux-form';

const styles = require('./comment-field.scss');

// These should come from redux-form typings somehow, but don't know how
interface ReduxFormProps {
  meta: WrappedFieldMetaProps<any>;
  input: any; // WrappedFieldInputProps
  // HTML props
  type: string;
  label: string;
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
}

const Field = ({
  input,
  placeholder,
  type,
  onKeyDown,
  meta: {
    error,
    touched,
  },
}: BaseFieldProps & ReduxFormProps) => {
  // TODO: remove the below. There currently seems to be a bug in tsc that makes it think
  // that the placeholder variable is not used: https://github.com/Microsoft/TypeScript/issues/15478
  placeholder; // tslint:disable-line
  onKeyDown; // tslint:disable-line

  const inputComponent = type === 'textarea' ?
    <Textarea {...input} placeholder={placeholder} type={type} rows={3} onKeyDown={onKeyDown} /> :
    <input {...input} placeholder={placeholder} type={type} onKeyDown={onKeyDown} />;

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

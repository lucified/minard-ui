import * as React from 'react';
import Textarea from 'react-autosize-textarea';
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
  disabled?: boolean;
}

interface PassedProps {
  fieldRef?: (ref: HTMLElement) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
}

type Props = PassedProps & ReduxFormProps & BaseFieldProps;

class Field extends React.Component<Props, void> {
  public render() {
    const {
      input,
      placeholder,
      disabled,
      type,
      onKeyDown,
      fieldRef,
      meta: {
        error,
        touched,
      },
    } = this.props;

    // TODO: remove the below. There currently seems to be a bug in tsc that makes it think
    // that the variables are not used if you spread an any: https://github.com/Microsoft/TypeScript/issues/15478
    placeholder; // tslint:disable-line
    onKeyDown; // tslint:disable-line
    disabled; // tslint:disable-line
    fieldRef; // tslint:disable-line

    const inputComponent = type === 'textarea' ? (
      <Textarea
        {...input}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        rows={3}
        innerRef={fieldRef}
        onKeyDown={onKeyDown}
      />
    ) : (
      <input
        {...input}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        ref={fieldRef}
        onKeyDown={onKeyDown}
      />
    );

    return (
      <div className={styles.field}>
        <div>
          {touched && error && <span className={styles.error}>{error}</span>}
        </div>
        {inputComponent}
      </div>
    );
  }
}

export default Field;

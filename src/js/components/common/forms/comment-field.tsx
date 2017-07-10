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

class Field extends React.Component<Props> {
  public render() {
    const {
      input,
      placeholder,
      disabled,
      type,
      onKeyDown,
      fieldRef,
      meta: { error, touched },
    } = this.props;

    const inputComponent =
      type === 'textarea'
        ? <Textarea
            {...input}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            rows={3}
            innerRef={fieldRef}
            onKeyDown={onKeyDown}
          /> // tslint:disable-line:jsx-alignment
        : <input
            {...input}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            ref={fieldRef}
            onKeyDown={onKeyDown}
          />; // tslint:disable-line:jsx-alignment

    return (
      <div className={styles.field}>
        <div>
          {touched &&
            error &&
            <span className={styles.error}>
              {error}
            </span>}
        </div>
        {inputComponent}
      </div>
    );
  }
}

export default Field;

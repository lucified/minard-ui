import * as classNames from 'classnames';
import * as React from 'react';
import * as Gravatar from 'react-gravatar';

const styles = require('./avatar.scss');

interface Props {
  size?: 'xs' | 'sm' | 'm' | '40' | 'lg' | 'xl';
  email?: string;
  iconEmail?: string;
  initials?: string;
  title?: string;
}

// Get double the actual size (for retina displays)
const getRetinaSize = (sizeLabel: string): number => {
  switch (sizeLabel) {
    case 'xs':
      return 32;
    case 'sm':
      return 48;
    case '40':
      return 80;
    case 'lg':
      return 96;
    case 'xl':
      return 128;
    case 'm':
    default:
      return 64;
  }
};

const Avatar = ({ size, email, iconEmail, initials, title }: Props) => {
  const pixelSize = getRetinaSize(size);

  if (email) {
    return (
      <figure title={title} className={classNames(styles.avatar, styles[`avatar-${size}`])}>
        <Gravatar className={styles['avatar-img']} email={email} rating="pg" https size={pixelSize} />
        {iconEmail &&
          <Gravatar className={styles['avatar-icon']} email={iconEmail} rating="pg" https size={pixelSize * 0.4} />
        }
      </figure>
    );
  } else {
    return (
      <figure title={title} className={classNames(styles.avatar, styles[`avatar-${size}`], styles.initials)} data-initial={initials}>
        {iconEmail &&
          <Gravatar className={styles['avatar-icon']} email={iconEmail} rating="pg" https size={pixelSize * 0.4} />
        }
      </figure>
    );
  }
};

export default Avatar;

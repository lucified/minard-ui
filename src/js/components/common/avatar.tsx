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
  className?: string;
  shadow?: boolean;
}

// Get double the actual size (for retina displays)
const getRetinaSize = (sizeLabel?: string): number => {
  switch (sizeLabel) {
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

const Avatar = ({ size, email, iconEmail, initials, title, shadow, className }: Props) => {
  const pixelSize = getRetinaSize(size);
  const classes = classNames(styles.avatar, styles[`avatar-${size}`], className, { [styles.shadow]: !!shadow });

  if (email) {
    return (
      <figure title={title || email} className={classes}>
        <Gravatar className={styles['avatar-img']} email={email} rating="pg" size={pixelSize} />
        {iconEmail &&
          <Gravatar className={styles['avatar-icon']} email={iconEmail} rating="pg" size={pixelSize * 0.4} />
        }
      </figure>
    );
  } else {
    return (
      <figure title={title} className={classes} data-initial={initials}>
        {iconEmail &&
          <Gravatar className={styles['avatar-icon']} email={iconEmail} rating="pg" size={pixelSize * 0.4} />
        }
      </figure>
    );
  }
};

export default Avatar;

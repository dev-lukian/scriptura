import cn from 'classnames';
import Lottie from 'lottie-react';
import ScrollDownWhite from '../../../public/scroll-down.json';
import ScrollDownBlack from '../../../public/scroll-down-black.json';
import styles from './ScrollDown.module.css';

const ScrollDown = ({ text, colorMode }) => {
  return (
    <div className={styles.scrollDownWrapper}>
      <div className={cn('text-size-xs', 'text-center')}>{text}</div>
      <Lottie
        className={styles.scrollDown}
        loop={true}
        animationData={colorMode == 'dark' ? ScrollDownWhite : ScrollDownBlack}
      />
    </div>
  );
};

export default ScrollDown;

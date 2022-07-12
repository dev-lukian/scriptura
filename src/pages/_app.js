import { useState, useEffect, useRef } from 'react';
import '../../styles/globals.css';
import '../../public/fonts/style.css';
import styles from '../../styles/Home.module.css';

import Lottie from 'lottie-react';
import cn from 'classnames';

import MenuHamburgerWhite from '../../public/menu.json';
import MenuHamburgerBlack from '../../public/menu-black.json';

import Menu from '../components/Menu';
import CopiedAlert from '../components/CopiedAlert';

function MyApp({ Component, pageProps }) {
  const [colorMode, setColorMode] = useState('dark');
  const [showMenu, setShowMenu] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const menuRef = useRef();

  // Show copied to clipboard alert
  const onCopy = () => {
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  const handleMenuClick = () => {
    if (!showMenu) menuRef.current.playSegments([0, 50], true);
    else menuRef.current.playSegments([50, 0], true);
    setShowMenu(!showMenu);
  };

  // Change color mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
  }, [colorMode]);

  useEffect(() => {
    menuRef.current.setSpeed(3);
  }, []);

  return (
    <>
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} handleMenuClick={handleMenuClick} onCopy={onCopy} />
      <div className={styles.menuHover}>
        <button className={cn('button', 'round')}>
          <Lottie
            className={cn(styles.menuButtonLottie)}
            lottieRef={menuRef}
            loop={false}
            autoplay={false}
            onClick={handleMenuClick}
            animationData={colorMode == 'dark' ? MenuHamburgerWhite : MenuHamburgerBlack}
          />
        </button>
      </div>
      <Component {...pageProps} colorMode={colorMode} setColorMode={setColorMode} onCopy={onCopy} />
      <CopiedAlert visible={showCopyAlert} />
    </>
  );
}

export default MyApp;

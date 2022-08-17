/* eslint-disable @next/next/inline-script-id */
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

import '../../styles/globals.css';
import '../../public/fonts/style.css';
import styles from '../../styles/App.module.css';

import Lottie from 'lottie-react';
import cn from 'classnames';

import MenuHamburgerWhite from '../../public/menu.json';
import MenuHamburgerBlack from '../../public/menu-black.json';

import Menu from '../components/Menu';
import CopiedAlert from '../components/CopiedAlert';

function MyApp({ Component, pageProps }) {
  const [colorMode, setColorMode] = useState('dark');
  const [showSideControls, setShowSideControls] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const menuRef = useRef();
  const url = useRef();

  // Show copied to clipboard alert
  const onCopy = () => {
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  // Play menu lottie animation and make menu appear
  const handleMenuClick = () => {
    if (!showMenu) menuRef.current.playSegments([0, 20], true);
    else menuRef.current.playSegments([20, 0], true);
    setShowMenu(!showMenu);
  };

  // Change color mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
  }, [colorMode]);

  // Increase speed of menu lottie
  useEffect(() => {
    url.current = window.location.host;
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="/og-image.png" />
        <meta property="og:type" content="website" key="ogwebsite" />
        <meta property="og:image" content="/og-image.png" key="ogimage" />
        <meta property="og:site_name" content="Scriptura" key="ogsitename" />
      </Head>
      <Menu showMenu={showMenu} handleMenuClick={handleMenuClick} onCopy={onCopy} />
      {showSideControls && (
        <div className={cn(styles.menuHover)}>
          <button className={cn('button', 'circle')} onClick={handleMenuClick}>
            <Lottie
              className={cn(styles.menuButtonLottie)}
              lottieRef={menuRef}
              loop={false}
              autoplay={false}
              setSpeed={4}
              animationData={colorMode == 'dark' ? MenuHamburgerWhite : MenuHamburgerBlack}
            />
          </button>
        </div>
      )}
      <Component
        {...pageProps}
        colorMode={colorMode}
        setColorMode={setColorMode}
        onCopy={onCopy}
        showSideControls={showSideControls}
        setShowSideControls={setShowSideControls}
      />
      <CopiedAlert visible={showCopyAlert} />
    </>
  );
}

export default MyApp;

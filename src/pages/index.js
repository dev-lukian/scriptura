// NextJS/React
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

// NPM Modules
import ReactFullpage from '@fullpage/react-fullpage';
import cn from 'classnames';
import Lottie from 'lottie-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { firestore } from '../../firebase/clientApp';
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  getDocs,
} from '@firebase/firestore';
const passagesCollection = collection(firestore, 'passage');

// Other Components & Utility Functions
import BiblePassage from '../components/BiblePassage';
import CopiedAlert from '../components/CopiedAlert';
import { shareOnFacebook, shareOnTwitter, shareOnInstagram } from '../utils/share';

// Assets
import Logo from '../../public/logo.svg';
import CloseIcon from '../../public/close-x.svg';
import RightArrow from '../../public/right-arrow.svg';
import NormalMethod from '../../public/normal-method-icon.svg';
import FusionMethod from '../../public/fusion-method-icon.svg';
import ScrollDownWhite from '../../public/scroll-down.json';
import ScrollDownBlack from '../../public/scroll-down-black.json';
import LinkShare from '../../public/share-link.svg';
import TwitterShare from '../../public/share-twitter.svg';
import FacebookShare from '../../public/share-facebook.svg';
import InstagramShare from '../../public/share-instagram.svg';

// Styles
import styles from '../../styles/Home.module.css';

const Home = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hideSettingsText, setHideSettingsText] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [readingMethod, setReadingMethod] = useState('normal');
  const [colorMode, setColorMode] = useState('dark');
  const [activeSection, setActiveSection] = useState();
  const [allowFullPageScrolling, setAllowFullPageScrolling] = useState(true);
  const [dailyPassage, setDailyPassage] = useState();
  const url = useRef();

  // Retrieves daily passage from firestore
  const getDailyPassage = async () => {
    const passageQuery = query(passagesCollection, limit(1));
    const querySnapshot = await getDocs(passageQuery);
    const result = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot._document.data.value.mapValue.fields);
    });
    setDailyPassage(result);
  };

  // Show copied to clipboard alert
  const onCopy = () => {
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  const fullPageScrolling = (enable) => {
    setAllowFullPageScrolling(enable);
    fullpage_api.setAllowScrolling(enable);
    fullpage_api.setKeyboardScrolling(enable);
  };

  // Component did mount
  useEffect(() => {
    getDailyPassage();
    url.current = 'www.' + window.location.host;
  }, []);

  // Change color mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
  }, [colorMode]);

  // Disable/enable scroll when leaving/entering normal reading section
  useEffect(() => {
    // Case #1: Entering normal reading section
    if (readingMethod == 'normal' && allowFullPageScrolling && activeSection == 1) {
      fullPageScrolling(false);
    }

    // Case #2: Leaving normal reading section
    if (activeSection != 1 && !allowFullPageScrolling) {
      fullPageScrolling(true);
    }

    // Case #3: Change to fusion mode when in the reading section
    if (readingMethod == 'fusion' && !allowFullPageScrolling) {
      fullPageScrolling(true);
    }
  }, [activeSection, readingMethod]);

  // Hide settings text after the first section
  useEffect(() => {
    if (activeSection !== undefined) {
      if (activeSection === 0 && hideSettingsText) setHideSettingsText(false);
      if (activeSection !== 0 && !hideSettingsText) setHideSettingsText(true);
    }
  }, [activeSection]);

  return (
    <>
      <Head>
        <title>Lightway</title>
        <meta name="description" content="Lightway - Bible Reading Experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {dailyPassage && (
        <>
          <div
            className={cn(styles.settingsHover, isSettingsOpen && styles.disappear)}
            onClick={() => setIsSettingsOpen(true)}
          >
            <div
              className={cn(
                styles.settingsTextWrapper,
                hideSettingsText && styles.settingsTextHide
              )}
            >
              <div className={styles.settingsText}>Settings</div>
              <RightArrow className={styles.rightArrow} />
            </div>
          </div>
          <div
            className={cn(styles.settingsWrapper, isSettingsOpen ? styles.settingsAppear : null)}
          >
            <div className={cn('button', 'round')} onClick={() => setIsSettingsOpen(false)}>
              Close
              <CloseIcon />
            </div>
            <div className={styles.settingOptionsWrapper}>
              <div
                className={cn(
                  styles.settingOptionBlock,
                  styles.settingOptionTop,
                  readingMethod == 'fusion' ? styles.active : null
                )}
                onClick={() => setReadingMethod('fusion')}
              >
                <FusionMethod className={styles.methodIcon} />
                Fusion
              </div>
              <div
                className={cn(
                  styles.settingOptionBlock,
                  styles.settingOptionBottom,
                  readingMethod == 'normal' ? styles.active : null
                )}
                onClick={() => setReadingMethod('normal')}
              >
                <NormalMethod className={styles.methodIcon} />
                Normal
              </div>
            </div>
            <div className={styles.settingOptionsWrapper}>
              <div
                className={cn(
                  styles.settingOptionBlock,
                  styles.settingOptionTop,
                  colorMode == 'dark' ? styles.active : null
                )}
                onClick={() => setColorMode('dark')}
              >
                <div className={styles.innerCircle}>
                  {colorMode == 'dark' ? <div className={styles.outerCircle}></div> : null}
                </div>
                Dark
              </div>
              <div
                className={cn(
                  styles.settingOptionBlock,
                  styles.settingOptionBottom,
                  colorMode == 'light' ? styles.active : null
                )}
                onClick={() => setColorMode('light')}
              >
                <div className={cn(styles.innerCircle, styles.whiteCircle)}>
                  {colorMode == 'light' ? <div className={styles.outerCircle}></div> : null}
                </div>
                Light
              </div>
            </div>
          </div>
          <ReactFullpage
            //fullpage options
            licenseKey={'YOUR_KEY_HERE'}
            scrollingSpeed={1000} /* Options here */
            scrollOverflow={true}
            keyboardScrolling={true}
            // anchors={["1", "2", "3", "4"]}
            normalScrollElements={'#normalWrapper'}
            onLeave={(origin, destination, direction, trigger) => {
              setActiveSection(destination.index);
            }}
            render={({ state, fullpageApi }) => {
              return (
                <ReactFullpage.Wrapper>
                  <div className={cn(styles.container, 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={styles.introWrapper}>
                      <div>
                        <Logo className={styles.lightwayLogo} />
                      </div>
                      <div className={styles.studyTitleWrapper}>
                        <div className="text-size-s">Test</div>
                        <div className="text-size-xl">{dailyPassage[0].title.stringValue}</div>
                      </div>
                      <div className={styles.scrollDownWrapper}>
                        <div className={cn('text-size-xs', 'text-center')}>
                          Scroll to begin study
                        </div>
                        <Lottie
                          className={styles.scrollDown}
                          loop={true}
                          animationData={colorMode == 'dark' ? ScrollDownWhite : ScrollDownBlack}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={cn('section', styles.passageSection, 'fp-noscroll')}>
                    <BiblePassage
                      method={readingMethod}
                      passage={dailyPassage[0].verses.stringValue}
                      allowFullPageScrolling={allowFullPageScrolling}
                      onCopy={onCopy}
                    />
                  </div>
                  <div className={cn(styles.container, 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={styles.shareWrapper}>
                      <div></div>
                      <div className={cn('text-size-l')}>
                        {dailyPassage[0].question.stringValue}
                      </div>
                      <div className={styles.scrollDownWrapper}>
                        <Lottie
                          className={styles.scrollDown}
                          loop={true}
                          animationData={colorMode == 'dark' ? ScrollDownWhite : ScrollDownBlack}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={cn(styles.container, 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={cn(styles.shareWrapper)}>
                      <div className={cn(styles.shareTop, 'text-size-s', 'text-center')}>
                        Daily Growth from God’s Word.
                      </div>
                      <div className={styles.shareMiddle}>
                        <div className={cn('text-size-l', 'text-center')}>Share the Gospel.</div>
                        <div className={styles.shareButtonsWrapper}>
                          <CopyToClipboard text={url.current} onCopy={onCopy}>
                            <button className={styles.shareButton}>
                              <LinkShare className={styles.shareIcon} />
                            </button>
                          </CopyToClipboard>
                          <button className={styles.shareButton} onClick={shareOnTwitter}>
                            <TwitterShare />
                          </button>
                          <button className={styles.shareButton} onClick={shareOnFacebook}>
                            <FacebookShare />
                          </button>
                          <button className={styles.shareButton} onClick={shareOnInstagram}>
                            <InstagramShare />
                          </button>
                        </div>
                      </div>
                      <div className={cn(styles.shareBottom, 'text-size-xs')}>
                        <CopyToClipboard text={url.current} onCopy={onCopy}>
                          <button className={cn('button', 'round')}>{url.current}</button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                </ReactFullpage.Wrapper>
              );
            }}
          />
        </>
      )}
      <CopiedAlert visible={showCopyAlert} />
    </>
  );
};

export default Home;

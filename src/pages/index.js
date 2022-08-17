/* eslint-disable react/no-unescaped-entities */
// NextJS/React
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

// NPM Modules
import ReactFullpage from '@fullpage/react-fullpage';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { firestore } from '../../firebase/clientApp';
import { collection, query, where, limit, getDocs } from '@firebase/firestore';

// Other Components & Utility Functions
import BiblePassage from '../components/BiblePassage';
import ScrollDown from '../components/ScrollDown';
import SectionNavigation from '../components/SectionNavigation';
import { shareOnFacebook, shareOnTwitter, shareOnInstagram } from '../utils/share';

// Assets
import Logo from '../../public/logo.svg';
import CloseIcon from '../../public/close-x.svg';
import RightArrow from '../../public/right-arrow.svg';
import NormalMethod from '../../public/normal-method-icon.svg';
import FusionMethod from '../../public/fusion-method-icon.svg';
import LinkShare from '../../public/share-link.svg';
import TwitterShare from '../../public/share-twitter.svg';
import FacebookShare from '../../public/share-facebook.svg';
import InstagramShare from '../../public/share-instagram.svg';

// Styles
import styles from '../../styles/Index.module.css';

const sections = ['Introduction', 'Read', 'Question', 'Share'];

const Home = ({ colorMode, setColorMode, onCopy, showSideControls, setShowSideControls }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [readingMethod, setReadingMethod] = useState('normal');
  const [activeSection, setActiveSection] = useState();
  const [allowFullPageScrolling, setAllowFullPageScrolling] = useState(true);
  const [dailyPassage, setDailyPassage] = useState();
  const url = useRef();

  // Retrieves daily passage from firestore
  const getDailyPassage = async () => {
    const cachedPassage = sessionStorage.getItem('dailyPassage');
    if (cachedPassage != null) {
      setDailyPassage(JSON.parse(cachedPassage));
    } else {
      const passagesCollection = collection(firestore, 'passage');
      const passageQuery = query(passagesCollection, limit(1), where('currentPassage', '==', true));
      const querySnapshot = await getDocs(passageQuery);
      const result = querySnapshot._snapshot.docChanges[0].doc.data.value.mapValue.fields;
      setDailyPassage(result);
      sessionStorage.setItem('dailyPassage', JSON.stringify(result));
    }
  };

  const fullPageScrolling = (enable) => {
    setAllowFullPageScrolling(enable);
    fullpage_api.setAllowScrolling(enable);
  };

  // Component did mount
  useEffect(() => {
    getDailyPassage();
    url.current = window.location.host;
  }, []);

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

  // 1) Hide settings text after the first section
  // 2) Hide menu button in the reading portion
  useEffect(() => {
    if (activeSection !== undefined) {
      if (activeSection === 1 && showSideControls) setShowSideControls(false);
      if (activeSection !== 1 && !showSideControls) setShowSideControls(true);
    }
  }, [activeSection]);

  return (
    <>
      <Head>
        <title>Read Scripture | Scriptura</title>
        <meta name="description" content="The new way to read Scripture daily" />
        <meta property="og:title" content="Read Scripture | Scriptura" key="ogtitle" />
        <meta property="og:description" content="The new way to read Scripture daily" key="ogdesc" />
      </Head>
      {dailyPassage && (
        <>
          {showSideControls && <SectionNavigation sections={sections} activeSection={activeSection} />}
          <div
            className={cn(styles.settingsHover, isSettingsOpen && styles.disappear)}
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className={cn(styles.settingsTextWrapper, !showSideControls && styles.settingsTextHide)}>
              <div className={styles.settingsText}>Settings</div>
              <RightArrow className={styles.rightArrow} />
            </div>
          </div>

          <div className={cn(styles.settingsWrapper, isSettingsOpen ? styles.settingsAppear : null)}>
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
            licenseKey={'1K657-9OWO9-KBVY6-RJO1I-TGMZM'}
            scrollingSpeed={1000}
            scrollOverflow={true}
            keyboardScrolling={false}
            normalScrollElements={'#normalWrapper'}
            onLeave={(origin, destination, direction, trigger) => {
              setActiveSection(destination.index);
            }}
            render={({ state, fullpageApi }) => {
              return (
                <ReactFullpage.Wrapper>
                  <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={'section-wrapper'}>
                      <div>
                        <Logo className="lightwayLogo" />
                      </div>
                      <div className={styles.studyTitleWrapper}>
                        <div className="text-size-s">Today's Study</div>
                        <div className="text-size-xl">{dailyPassage.title.stringValue}</div>
                      </div>
                      <ScrollDown text="Scroll to begin study" colorMode={colorMode} />
                    </div>
                  </div>
                  <div className={cn('section', styles.passageSection, 'fp-noscroll')}>
                    <BiblePassage
                      method={readingMethod}
                      passage={dailyPassage.verses.stringValue}
                      allowFullPageScrolling={allowFullPageScrolling}
                      onCopy={onCopy}
                      activeSection={activeSection}
                    />
                  </div>
                  <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={'section-wrapper'}>
                      <div></div>
                      <div className={cn('text-size-l')}>{dailyPassage.question.stringValue}</div>
                      <ScrollDown text="" colorMode={colorMode} />
                    </div>
                  </div>
                  <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                    <div className={'section-wrapper'}>
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
                      <div>
                        <CopyToClipboard text={url.current} onCopy={onCopy}>
                          <button className={cn('button', 'round', 'text-size-xs')}>{url.current}</button>
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
    </>
  );
};

export default Home;

/* eslint-disable react/no-unescaped-entities */
// NextJS/React
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

// NPM Modules
import ReactFullpage from '@fullpage/react-fullpage';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ScrollDown from '../components/ScrollDown';
import { shareOnFacebook, shareOnTwitter, shareOnInstagram } from '../utils/share';

import Logo from '../../public/logo.svg';
import LinkShare from '../../public/share-link.svg';
import TwitterShare from '../../public/share-twitter.svg';
import FacebookShare from '../../public/share-facebook.svg';
import InstagramShare from '../../public/share-instagram.svg';

// Styles
import styles from '../../styles/LifeIsShort.module.css';

const LifeIsShort = ({ colorMode, onCopy }) => {
  const [age, setAge] = useState();
  const [activeSection, setActiveSection] = useState();
  const [slidePause, setSlidePause] = useState(false);
  const [slideFreeze, setSlideFreeze] = useState(false);
  const [ageAnimationProgress, setAgeAnimationProgress] = useState(0);
  const [ageBarTransitionTime, setAgeBarTransitionTime] = useState('0ms');
  const [ageBarProgress, setAgeBarProgress] = useState('0%');
  const [relativeAgeAnimationProgress, setRelativeAgeAnimationProgress] = useState(0);
  const [relativeBarTransitionTime, setRelativeBarTransitionTime] = useState('0ms');
  const [relativeBarProgress, setRelativeBarProgress] = useState('0%');
  const relativeLabels = useRef(new Array());
  const relativeLabelWrapper = useRef();
  const url = useRef();

  useEffect(() => {
    if (age > 80) setAge(80);
    else if (age < 0) setAge(0);

    if (age) setSlideFreeze(false);
    else setSlideFreeze(true);
  }, [age]);

  useEffect(() => {
    if (activeSection == 1) {
      setAgeAnimationProgress(0);
      setAgeBarProgress('0%');
      setAgeBarTransitionTime('0ms');
      setRelativeAgeAnimationProgress(0);
      setRelativeBarProgress('0%');
      setRelativeBarTransitionTime('0ms');
    } else if (activeSection == 2) {
      if (age && !slidePause) {
        if (ageAnimationProgress < age) {
          setTimeout(() => setAgeAnimationProgress((ageAnimationProgress) => ageAnimationProgress + 1), 45);
        }
      }
    } else if (activeSection == 3) {
      setAgeAnimationProgress(age);
      if (age && !slidePause) {
        if (relativeAgeAnimationProgress < age) {
          setTimeout(
            () => setRelativeAgeAnimationProgress((relativeAgeAnimationProgress) => relativeAgeAnimationProgress + 1),
            age - relativeAgeAnimationProgress
          );
        }
      }
    } else if (activeSection == 4) {
      setRelativeAgeAnimationProgress(age);
    }
  }, [activeSection, ageAnimationProgress, relativeAgeAnimationProgress, slidePause]);

  useEffect(() => {
    if (activeSection == 2 && !slidePause && age) {
      setAgeBarProgress((age / 80) * 100 + '%');
      setAgeBarTransitionTime(50 * age + 'ms');
    }

    if (activeSection == 3 && !slidePause && age) {
      const labelMax = relativeLabels.current[Math.ceil(age / 10)].offsetLeft;
      const labelMin = relativeLabels.current[Math.floor(age / 10)].offsetLeft;
      const labelDistanceIncrement = (age % 10) * ((labelMax - labelMin) / 10);
      const labelsWrapperWidth = relativeLabelWrapper.current.clientWidth;
      const labelsWrapperOffset = relativeLabelWrapper.current.offsetLeft;
      const barProgress = ((labelMin - labelsWrapperOffset + labelDistanceIncrement) / labelsWrapperWidth) * 105;
      setRelativeBarProgress(barProgress.toString() + '%');
      setRelativeBarTransitionTime((Math.pow(age, 2) + 50) / 2 + 'ms');
    }
  }, [slidePause]);

  useEffect(() => {
    if (activeSection == 0) {
      fullpage_api.setAllowScrolling(true, 'down');
    }

    if (activeSection == 1) {
      if (slideFreeze) fullpage_api.setAllowScrolling(false, 'down');
      else fullpage_api.setAllowScrolling(true, 'down');
    }
  }, [slideFreeze, activeSection]);

  useEffect(() => {
    url.current = window.location.host;
  }, []);

  return (
    <>
      <Head>
        <title>Life is short | Scriptura</title>
        <meta name="description" content="We all know life is short. But what can we take away from that fact?" />
        <meta property="og:title" content="Life is short | Scriptura" key="ogtitle" />
        <meta
          property="og:description"
          content="We all know life is short. But what can we take away from that fact?"
          key="ogdesc"
        />
      </Head>
      <ReactFullpage
        //fullpage options
        licenseKey={'1K657-9OWO9-KBVY6-RJO1I-TGMZM'}
        scrollingSpeed={1000}
        scrollOverflow={true}
        keyboardScrolling={false}
        onLeave={(origin, destination, direction, trigger) => {
          setSlidePause(true);
          setActiveSection(destination.index);
          setTimeout(() => setSlidePause(false), 600);
        }}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div>
                    <Logo className="lightwayLogo" />
                  </div>
                  <div className={cn('flex-center', 'flex-column', 'text-center')}>
                    <div className="text-size-l">We all know life is short.</div>
                    <div className={cn('text-size-s', styles.jamesVerseWrapper)}>
                      <div>“You are just a vapor that appears for a little while and then vanishes away.”</div>
                      <div>James 4:14 </div>
                    </div>
                  </div>
                  <ScrollDown text="But, just how short is it?" colorMode={colorMode} />
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div></div>
                  <div className={cn('flex-center', 'flex-column', 'text-center', styles.ageWrapper)}>
                    <div className={cn('text-size-m', styles.visualizeText)}>
                      But just how short is it really? Enter your age to find out.
                    </div>
                    <form className={cn('flex-center', 'flex-column', styles.ageInputWrapper)}>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        onChange={(event) => setAge(event.target.value)}
                        placeholder={0}
                        className={cn(styles.ageInput, 'text-size-l')}
                      />
                      <label htmlFor="age" className="text-size-xs">
                        How old are you?
                      </label>
                    </form>
                  </div>
                  <div className={cn(styles.scrollDownTransition, age ? styles.visible : styles.hidden)}>
                    <ScrollDown text="Let’s see it." colorMode={colorMode} />
                  </div>
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div></div>
                  <div className={cn('flex-center', 'flex-column', 'text-center', 'width-100-percent')}>
                    <div className={cn('text-size-m', styles.doYouThinkText)}>
                      Here’s where you’re at compared to the average human lifespan.
                    </div>
                    <div className="text-size-s">The average lifespan is 76.8 years.</div>
                    <div className={cn('width-100-percent', styles.yearAnimationWrapper)}>
                      <div className={styles.yearBar}>
                        <div
                          className={styles.activeYearBar}
                          style={{
                            width: ageBarProgress,
                            transitionDuration: ageBarTransitionTime,
                            transitionProperty: 'width',
                            transitionTimingFunction: 'linear',
                          }}
                        ></div>
                      </div>
                      <div ref={relativeLabelWrapper} className={styles.yearLabelWrapper}>
                        {[1, 10, 20, 30, 40, 50, 60, 70, 80].map((element, index) => {
                          return (
                            <div
                              className={cn(
                                styles.yearLabel,
                                'text-size-s',
                                ageAnimationProgress >= element && styles.activeYearLabel
                              )}
                              key={index}
                            >
                              {index != 0 && element}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      styles.scrollDownTransition,
                      age == ageAnimationProgress ? styles.visible : styles.hidden
                    )}
                  >
                    <ScrollDown text="Realize just how short life is." colorMode={colorMode} />
                  </div>
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div></div>
                  <div className={cn('flex-center', 'flex-column', 'text-center', 'width-100-percent')}>
                    <div className="text-size-m">But really, it’s more like this.</div>
                    <div className={cn('text-size-s', styles.asYouGetOlderText)}>
                      As you get older, years turn into months, months turn into weeks, and weeks pass by just like
                      days. <br />
                      <br />
                      You never have as much as you think.
                    </div>
                    <div className={cn('width-100-percent', styles.yearAnimationWrapper)}>
                      <div className={styles.yearBar}>
                        <div
                          className={styles.activeYearBar}
                          style={{
                            width: relativeBarProgress,
                            transitionDuration: relativeBarTransitionTime,
                            transitionProperty: 'width',
                            transitionTimingFunction: 'ease-in',
                          }}
                        ></div>
                      </div>
                      <div ref={relativeLabelWrapper} className={styles.yearLabelWrapper}>
                        {[1, 10, 20, 30, 40, 50, 60, 70, 80].map((element, index) => {
                          return (
                            <div
                              className={cn(
                                styles.yearLabel,
                                'text-size-s',
                                relativeAgeAnimationProgress >= element && styles.activeYearLabel
                              )}
                              style={{ paddingRight: (80 - element) / 7 + '%' }}
                              key={index}
                              ref={(label) => (relativeLabels.current[index] = label)}
                            >
                              {index != 0 && element}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      styles.scrollDownTransition,
                      age == relativeAgeAnimationProgress ? styles.visible : styles.hidden
                    )}
                  >
                    <ScrollDown text="What can you do about it?" colorMode={colorMode} />
                  </div>
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div></div>
                  <div className={cn('flex-center', 'flex-column', 'text-center')}>
                    <div className={cn('text-size-l', styles.dontWasteItText)}>
                      God’s given you one life, don’t waste it.
                    </div>
                    <div className={cn('text-size-s', styles.jamesVerseWrapper)}>
                      <div>“The world is passing away with its lusts, but he who does God's will remains forever.”</div>
                      <div>1 John 2:17</div>
                    </div>
                  </div>
                  <ScrollDown text="Spread the word" colorMode={colorMode} />
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className={'section-wrapper'}>
                  <div>
                    <Logo className="lightwayLogo" />
                  </div>
                  <div className={styles.shareMiddle}>
                    <div className={cn('text-size-l', 'text-center')}>Spread the Word.</div>
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
  );
};

export default LifeIsShort;

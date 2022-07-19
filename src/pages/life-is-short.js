/* eslint-disable react/no-unescaped-entities */
// NextJS/React
import { useEffect, useState, useRef } from 'react';

// NPM Modules
import ReactFullpage from '@fullpage/react-fullpage';
import cn from 'classnames';

import Logo from '../../public/logo.svg';
import ScrollDown from '../components/ScrollDown';

// Styles
import styles from '../../styles/LifeIsShort.module.css';

const LifeIsShort = ({ colorMode }) => {
  const [age, setAge] = useState();
  const [activeSection, setActiveSection] = useState();
  const [ageAnimationProgress, setAgeAnimationProgress] = useState(0);
  const [relativeAgeAnimationProgress, setRelativeAgeAnimationProgress] = useState(0);
  const [slidePause, setSlidePause] = useState(false);
  const [relativeBarTransitionTime, setRelativeBarTransitionTime] = useState('0ms');
  const [relativeBarProgress, setRelativeBarProgress] = useState('0%');
  const relativeLabels = useRef(new Array());
  const relativeLabelWrapper = useRef();

  useEffect(() => {
    if (age > 80) setAge(80);
    else if (age < 0) setAge(0);
  }, [age]);

  useEffect(() => {
    if (activeSection == 2) {
      setRelativeAgeAnimationProgress(0);
      setRelativeBarProgress('0%');
      setRelativeBarTransitionTime('0ms');
      if (age && !slidePause) {
        if (ageAnimationProgress < age) {
          setTimeout(() => setAgeAnimationProgress((ageAnimationProgress) => ageAnimationProgress + 1), 75);
        }
      }
    } else if (activeSection == 3) {
      setAgeAnimationProgress(age);
      if (age && !slidePause) {
        setAgeAnimationProgress(0);
        if (relativeAgeAnimationProgress < age) {
          setTimeout(
            () => setRelativeAgeAnimationProgress((relativeAgeAnimationProgress) => relativeAgeAnimationProgress + 1),
            age - relativeAgeAnimationProgress
          );
        }
      }
    } else if (activeSection == 1) {
      setRelativeAgeAnimationProgress(0);
      setAgeAnimationProgress(0);
      setRelativeBarProgress('0%');
      setRelativeBarTransitionTime('0ms');
    } else {
      setRelativeAgeAnimationProgress(age);
    }
  }, [activeSection, ageAnimationProgress, relativeAgeAnimationProgress, slidePause]);

  useEffect(() => {
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

  return (
    <>
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
                    <div className="text-size-l">Life is short</div>
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
                      Visualize the time you have left based on average lifespan.
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
                    <ScrollDown text="Let’s find out" colorMode={colorMode} />
                  </div>
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div></div>
                  <div className={cn('flex-center', 'flex-column', 'text-center', 'width-100-percent')}>
                    <div className={cn('text-size-m', styles.doYouThinkText)}>
                      Do you think this is the time you have left?
                    </div>
                    <div className="text-size-s">The average lifespan is 76.8 years.</div>
                    <div className={cn('width-100-percent', styles.yearAnimationWrapper)}>
                      <div className={styles.yearTicWrapper}>
                        {[...Array(80).keys()].map((element, index) => {
                          return (
                            <div
                              className={cn(styles.yearTic, ageAnimationProgress > index && styles.activeYearTic)}
                              key={index}
                            ></div>
                          );
                        })}
                      </div>
                      <div className={styles.yearLabelWrapper}>
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
                    <div className="text-size-m">Time is relative</div>
                    <div className={cn('text-size-s', styles.asYouGetOlderText)}>
                      As you get older, years turn into months, months into weeks, and weeks pass by like days.
                    </div>
                    <div className={cn('width-100-percent', styles.yearAnimationWrapper)}>
                      <div className={styles.yearBar}>
                        <div
                          className={styles.activeYearBar}
                          style={{
                            width: relativeBarProgress,
                            transitionDuration: relativeBarTransitionTime,
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
                    <ScrollDown text="Why does understanding this matter?" colorMode={colorMode} />
                  </div>
                </div>
              </div>
              <div className={cn('container', 'section', 'fp-noscroll', 'page-padding')}>
                <div className="section-wrapper">
                  <div>
                    <Logo className="lightwayLogo" />
                  </div>
                  <div className={cn('flex-center', 'flex-column', 'text-center')}>
                    <div className={cn('text-size-l', styles.dontWasteItText)}>Life is short, don't waste it.</div>
                    <div className={cn('text-size-s', styles.jamesVerseWrapper)}>
                      <div>
                        "Yet you do not know what tomorrow will bring. What is your life? For you are a mist that
                        appears for a little time and then vanishes."
                      </div>
                      <div>James 4:14</div>
                    </div>
                  </div>
                  <div></div>
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

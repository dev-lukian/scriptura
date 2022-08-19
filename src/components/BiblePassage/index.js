// NextJS/React
import { useEffect, useState, useRef, useCallback } from 'react';

// NPM Modules
import cn from 'classnames';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import debounce from 'lodash.debounce';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSwipeable } from 'react-swipeable';
import Bowser from 'bowser';

// Assets
import ArrowBack from '../../../public/fusion-back.svg';
import ArrowForward from '../../../public/fusion-forward.svg';
import Restart from '../../../public/restart.svg';

// Styles
import styles from './BiblePassage.module.css';

const BiblePassage = ({ method, passage, allowFullPageScrolling, onCopy, activeSection }) => {
  // Normal States/Refs
  const [normalPassage, setNormalPassage] = useState();
  const [activeVerse, setActiveVerse] = useState(0);
  const scrollUpBuffer = useRef();
  const scrollDownBuffer = useRef();
  const versesWithBuffer = useRef(new Array());
  const safari = useRef();
  const swipe = useRef(false);
  const scroll = useRef(false);
  const scrollOptions = useRef({
    duration: 0,
    behavior: 'smooth',
  });
  const scrollOptionsSafari = useRef({
    duration: 400,
    behavior: 'smooth',
    ease: (t) => t,
  });

  //Fusion States/Refs
  const [fusionPassage, setFusionPassage] = useState();
  const [fusionPlay, setFusionPlay] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const timer = useRef();

  const { ref } = useSwipeable({
    onSwipedUp: () => !allowFullPageScrolling && animateScroll('down'),
    onSwipedDown: () => !allowFullPageScrolling && animateScroll('up'),
  });

  const animateScroll = (direction) => {
    let nextVerse;

    if (direction == 'up') {
      nextVerse = versesWithBuffer.current[activeVerse - 1];
    } else {
      nextVerse = versesWithBuffer.current[activeVerse + 1];
    }

    smoothScrollIntoView(
      nextVerse,
      safari.current && !swipe.current ? scrollOptionsSafari.current : scrollOptions.current
    );

    direction == 'up' ? setActiveVerse(--activeVerse) : setActiveVerse(++activeVerse);
  };

  // Snap scroll to verse with arrow key event
  const verseKeyScroll = (event) => {
    if (!scroll.current) {
      scroll.current = true;
      if (event.key == 'ArrowUp' && activeVerse > 0) animateScroll('up');
      else if (event.key == 'ArrowDown' && activeVerse < versesWithBuffer.current.length - 1) animateScroll('down');
      setTimeout(() => (scroll.current = false), 200);
    }
  };

  // Snap scroll to verse with wheel event
  const verseWheelScroll = (event) => {
    if (!scroll.current) {
      scroll.current = true;
      if (event.deltaY < 0 && activeVerse > 0) animateScroll('up');
      else if (event.deltaY > 0 && activeVerse < versesWithBuffer.current.length - 1) animateScroll('down');
      setTimeout(() => (scroll.current = false), 200);
    }
  };

  const debounceVerseScroll = useCallback(
    debounce(verseWheelScroll, 35, {
      leading: true,
      trailing: false,
    }),
    []
  );

  const debounceVerseScrollSafari = useCallback(
    debounce(verseWheelScroll, 70, {
      leading: true,
      trailing: false,
    }),
    []
  );

  const toggleResume = () => {
    setFusionPlay(!fusionPlay);
  };

  // forward: boolean
  // If true, move 10 forward
  // If false, move 10 back
  const skipWords = (forward) => {
    if (forward) {
      setFusionProgress((fusionProgress) => Math.min(fusionProgress + 10, fusionPassage.length - 1));
    } else {
      setFusionProgress((fusionProgress) => Math.max(fusionProgress - 10, 0));
    }
  };

  const restart = (beginning) => {
    setFusionPlay(false);

    if (beginning) setFusionProgress(0);
    else setFusionProgress(fusionPassage.length - 1);
  };

  // Triggers fusion player to start playing when changing to fusion mode
  useEffect(() => {
    if (fusionPassage) {
      if (method == 'fusion') setTimeout(() => setFusionPlay(true), 900);
      else setFusionPlay(false);
    }
  }, [method]);

  // Triggers fusion player to start playing when changing
  useEffect(() => {
    if (activeSection !== undefined) {
      if (activeSection == 1 && method == 'fusion') setTimeout(() => setFusionPlay(true), 900);
      else setFusionPlay(false);
    }
  }, [activeSection]);

  // Start fusion player
  useEffect(() => {
    if (fusionPlay) {
      if (fusionProgress < fusionPassage.length - 1) {
        timer.current = setInterval(() => {
          setFusionProgress((fusionProgress) => fusionProgress + 1);
        }, 250);
      }
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [fusionPlay]);

  // Stop fusion player once it gets to the last word
  useEffect(() => {
    if (fusionPassage) {
      if (fusionProgress == fusionPassage.length - 1) {
        clearInterval(timer.current);
        setFusionPlay(false);
      }
    }
  }, [fusionProgress]);

  // Preparing normal method
  useEffect(() => {
    // Turning each line into its on element in an array
    const splitVerses = passage.split('\\n');

    // Remove space(s), if present in beginning of verse and at the end of verse
    for (let i = 0; i < splitVerses.length; i++) {
      while (splitVerses[i].charAt(0) === ' ' || splitVerses[i].charAt(0) === '\n') {
        splitVerses[i] = splitVerses[i].substring(1);
      }

      while (splitVerses[i].charAt(splitVerses[i].length - 1) === ' ') {
        splitVerses[i] = splitVerses[i].substring(0, splitVerses[i].length - 1);
      }
    }

    console.log(splitVerses);

    // Removing verse numbers
    // for (let i = 0; i < splitVerses.length; i++) {
    //   indexOfSpace = splitVerses[i].indexOf(" ");
    //   splitVerses[i] = splitVerses[i].substring(indexOfSpace + 1);
    // }

    console.log(splitVerses);

    setNormalPassage(splitVerses);
  }, []);

  // Preparing fusion method (each word pushed into an array)
  useEffect(() => {
    if (normalPassage) {
      let fusion = [];
      let splitWords;

      for (let i = 0; i < normalPassage.length; i++) {
        splitWords = normalPassage[i].split(' ');
        fusion = [...fusion, ...splitWords];
      }

      console.log(fusion);

      setFusionPassage(fusion);
    }

    // Assigning buffers to first and last index of versesWithBuffer array
    versesWithBuffer.current[0] = scrollUpBuffer.current;
    versesWithBuffer.current[versesWithBuffer.current.length] = scrollDownBuffer.current;
  }, [normalPassage]);

  // One buffer is scrolled to, move up or down a section
  useEffect(() => {
    if (activeVerse == versesWithBuffer.current.length - 1) fullpage_api.moveSectionDown();
    if (activeVerse == 0) fullpage_api.moveSectionUp();
  }, [activeVerse]);

  // Add/remove scroll event listener when entering/leaving normal reading section
  useEffect(() => {
    if (!allowFullPageScrolling) {
      window.addEventListener(
        'wheel',
        safari.current && !swipe.current ? debounceVerseScrollSafari : debounceVerseScroll
      );
    } else {
      window.removeEventListener(
        'wheel',
        safari.current && !swipe.current ? debounceVerseScrollSafari : debounceVerseScroll
      );
    }
  }, [allowFullPageScrolling]);

  // Add Swipe listener
  useEffect(() => {
    ref(window);
  }, []);

  // Detects browser and device type
  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserType = browser.parsedResult.browser.name;
    const deviceType = browser.parsedResult.platform.type;

    browserType == 'Safari' ? (safari.current = true) : (safari.current = false);
    deviceType == 'tablet' || deviceType == 'mobile' ? (swipe.current = true) : (swipe.current = false);
  }, []);

  return (
    <>
      {method == 'normal'
        ? normalPassage && (
            <div id="normalWrapper" className={cn(styles.normalWrapper, 'page-padding')}>
              <div ref={scrollUpBuffer}></div>
              {normalPassage.map((verse, index) => {
                return (
                  <CopyToClipboard text={normalPassage[index]} key={index} onCopy={onCopy}>
                    <p
                      className={cn('text-size-m', styles.verse, activeVerse - 1 == index && styles.activeVerse)}
                      ref={(verse) => (versesWithBuffer.current[index + 1] = verse)}
                    >
                      {verse}
                    </p>
                  </CopyToClipboard>
                );
              })}
              <div ref={scrollDownBuffer}></div>
            </div>
          )
        : fusionPassage && (
            <div className={styles.fusionWrapper}>
              <div className="text-size-xl">{fusionPassage[fusionProgress]}</div>
              <div className={cn(styles.fusionButtonsWrapper, 'text-size-s')}>
                <div className={styles.fusionMoveButtonsWrapper}>
                  <button
                    className={cn('button', 'light-button', 'round', 'text-size-s', styles.restartButton)}
                    onClick={() => restart(true)}
                  >
                    <Restart />
                  </button>
                  <button
                    className={cn('button', 'light-button', 'round', 'text-size-s')}
                    onClick={() => skipWords(false)}
                  >
                    <ArrowBack />
                    10
                  </button>
                </div>
                <button className={cn('button', 'round', 'text-size-s')} onClick={toggleResume}>
                  {fusionPlay ? 'Pause' : 'Resume'}
                </button>
                <div className={styles.fusionMoveButtonsWrapper}>
                  <button
                    className={cn('button', 'light-button', 'round', 'text-size-s')}
                    onClick={() => skipWords(true)}
                  >
                    10
                    <ArrowForward />
                  </button>
                  <button
                    className={cn('button', 'light-button', 'round', 'text-size-s')}
                    onClick={() => restart(false)}
                  >
                    <Restart />
                  </button>
                </div>
              </div>
            </div>
          )}
      <div className={styles.translationDisclaimerWrapper}>
        <span className={styles.translationDisclaimer}>World English Bible (WEB) Translation</span>
      </div>
    </>
  );
};

export default BiblePassage;

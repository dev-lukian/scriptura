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

// Styles
import styles from './BiblePassage.module.css';

const BiblePassage = ({ method, passage, allowFullPageScrolling, onCopy }) => {
  // Normal
  const [normalPassage, setNormalPassage] = useState();
  const [activeVerse, setActiveVerse] = useState(0);
  const scrollUpBuffer = useRef();
  const scrollDownBuffer = useRef();
  const versesWithBuffer = useRef(new Array());
  const safari = useRef();
  const swipe = useRef();
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

  //Fusion
  const [fusionPassage, setFusionPassage] = useState();
  const [fusionPlay, setFusionPlay] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [fusionSpeed, setFusionSpeed] = useState(200);
  const timer = useRef();

  // const { ref } = useSwipeable({
  //   onSwipedUp: () => scrollDown(),
  //   onSwipedDown: () => scrollUp(),
  // });

  const handlers = useSwipeable({
    onSwipedUp: () => scrollDown(),
    onSwipedDown: () => scrollUp(),
  });

  const scrollUp = () => {
    smoothScrollIntoView(
      versesWithBuffer.current[activeVerse - 1],
      safari.current && !swipe.current ? scrollOptionsSafari.current : scrollOptions.current
    );
    setActiveVerse(--activeVerse);
  };

  const scrollDown = () => {
    smoothScrollIntoView(
      versesWithBuffer.current[activeVerse + 1],
      safari.current && !swipe.current ? scrollOptionsSafari.current : scrollOptions.current
    );
    setActiveVerse(++activeVerse);
  };

  // Snap scroll to verse
  const verseScroll = (event) => {
    console.log(event);
    if (!scroll.current) {
      scroll.current = true;
      if (event.deltaY < 0 && activeVerse > 0) {
        scrollUp();
      } else if (event.deltaY > 0 && activeVerse < versesWithBuffer.current.length - 1) {
        scrollDown();
      }
      setTimeout(() => (scroll.current = false), 200);
    }
  };

  const debounceVerseScroll = useCallback(
    debounce(verseScroll, 35, {
      leading: true,
      trailing: false,
    }),
    []
  );

  const debounceVerseScrollSafari = useCallback(
    debounce(verseScroll, 70, {
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

  // Start fusion player
  useEffect(() => {
    if (fusionPlay) {
      if (fusionProgress < fusionPassage.length - 1) {
        timer.current = setInterval(() => {
          setFusionProgress((fusionProgress) => fusionProgress + 1);
        }, fusionSpeed);
      }
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [fusionPlay, fusionSpeed]);

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

    // Remove space, if present in beginning of verse
    for (let i = 0; i < splitVerses.length; i++) {
      if (splitVerses[i].charAt(0) == ' ') {
        splitVerses[i] = splitVerses[i].substring(1);
      }
    }

    // Removing verse numbers
    // for (let i = 0; i < splitVerses.length; i++) {
    //   indexOfSpace = splitVerses[i].indexOf(" ");
    //   splitVerses[i] = splitVerses[i].substring(indexOfSpace + 1);
    // }

    setNormalPassage(splitVerses);
  }, []);

  // Preparing fusion method (each word pushed into an array)
  useEffect(() => {
    fullpage_api.reBuild();

    if (normalPassage) {
      let fusion = [];
      let splitWords;

      for (let i = 0; i < normalPassage.length; i++) {
        splitWords = normalPassage[i].split(' ');
        fusion = [...fusion, ...splitWords];
      }

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
    // ref(window);
    if (!allowFullPageScrolling)
      window.addEventListener(
        'wheel',
        safari.current && !swipe.current ? debounceVerseScrollSafari : debounceVerseScroll
      );
    else
      window.removeEventListener(
        'wheel',
        safari.current && !swipe.current ? debounceVerseScrollSafari : debounceVerseScroll
      );
  }, [allowFullPageScrolling]);

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
            <div {...handlers} id="normalWrapper" className={cn(styles.normalWrapper, 'page-padding')}>
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
                <button
                  className={cn('button', 'light-button', 'round', 'text-size-s')}
                  onClick={() => skipWords(false)}
                >
                  <ArrowBack />
                  10
                </button>
                <button className={cn('button', 'round', 'text-size-s')} onClick={toggleResume}>
                  {fusionPlay ? 'Pause' : 'Resume'}
                </button>
                <button
                  className={cn('button', 'light-button', 'round', 'text-size-s')}
                  onClick={() => skipWords(true)}
                >
                  10
                  <ArrowForward />
                </button>
              </div>
              <div className={cn(styles.fusionButtonsWrapper, 'text-size-s')}>
                <button
                  className={cn('button', 'light-button', 'round', 'text-size-s')}
                  onClick={() => setFusionSpeed(150)}
                >
                  150 ms
                </button>
                <button
                  className={cn('button', 'light-button', 'round', 'text-size-s')}
                  onClick={() => setFusionSpeed(200)}
                >
                  200 ms
                </button>
                <button
                  className={cn('button', 'light-button', 'round', 'text-size-s')}
                  onClick={() => setFusionSpeed(250)}
                >
                  250 ms
                </button>
              </div>
            </div>
          )}
    </>
  );
};

export default BiblePassage;

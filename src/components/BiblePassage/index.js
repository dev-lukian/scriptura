import { useEffect, useState, useRef } from "react";
import styles from "./BiblePassage.module.css";

import cn from "classnames";
import { useInView } from "react-intersection-observer";

import demoScripture from "./test.txt";
import TopArrow from "../../../public/top-arrow.svg";
import ArrowBack from "../../../public/fusion-back.svg";
import ArrowForward from "../../../public/fusion-forward.svg";

const BiblePassage = ({ method }) => {
  const [normalPassage, setNormalPassage] = useState();
  const [fusionPassage, setFusionPassage] = useState();
  const [fusionPlay, setFusionPlay] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [fusionSpeed, setFusionSpeed] = useState(400);
  const [scrollProgress, setScrollProgress] = useState(0);
  const refContainer = useRef();
  const timer = useRef();

  const onScroll = () => {
    if (refContainer.current) {
      const { scrollTop, scrollHeight, clientHeight } = refContainer.current;
      console.log(scrollTop, scrollHeight - clientHeight, clientHeight);
      const percentY = scrollTop / (scrollHeight - clientHeight);
      const progress = Math.min(Math.floor(percentY * 17), 16);
      console.log(progress);
      setScrollProgress(progress);
    }
  };

  const opacityForVerses = (sectionProgress, verseNum) => {
    const progress = sectionProgress - verseNum;
    if (progress >= 0 && progress < 1) return 1;
    return 0.3;
  };

  const toggleResume = () => {
    setFusionPlay(!fusionPlay);
  };

  const skipWords = (forward) => {
    if (forward) {
      setFusionProgress((fusionProgress) =>
        Math.min(fusionProgress + 10, fusionPassage.length - 1)
      );
    } else {
      setFusionProgress((fusionProgress) => Math.max(fusionProgress - 10, 0));
    }
  };

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
    const splitVerses = demoScripture.split("\n");
    let indexOfSpace;

    // Removing verse numbers
    for (let i = 0; i < splitVerses.length; i++) {
      indexOfSpace = splitVerses[i].indexOf(" ");
      splitVerses[i] = splitVerses[i].substring(indexOfSpace + 1);
    }

    setNormalPassage(splitVerses);
  }, []);

  // Preparing fusion method (each word pushed into an array)
  useEffect(() => {
    fullpage_api.reBuild();
    if (normalPassage) {
      let fusion = [];
      let splitWords;

      for (let i = 0; i < normalPassage.length; i++) {
        splitWords = normalPassage[i].split(" ");
        fusion = [...fusion, ...splitWords];
      }

      setFusionPassage(fusion);
    }
  }, [normalPassage]);

  useEffect(() => {
    fullpage_api.reBuild();
  }, [method]);

  return (
    <>
      {method == "normal"
        ? normalPassage && (
            <div
              ref={refContainer}
              onScroll={onScroll}
              id="normalWrapper"
              className={styles.normalWrapper}
            >
              {scrollProgress == 0 && (
                <div
                  className={cn(
                    styles.moveArrow,
                    styles.topArrow,
                    styles.button,
                    styles.lightButton
                  )}
                  onClick={() => fullpage_api.moveSectionUp()}
                >
                  <TopArrow />
                </div>
              )}
              {scrollProgress == normalPassage.length - 1 && (
                <div
                  className={cn(
                    styles.moveArrow,
                    styles.bottomArrow,
                    styles.button,
                    styles.lightButton
                  )}
                  onClick={() => fullpage_api.moveSectionDown()}
                >
                  <TopArrow />
                </div>
              )}
              {normalPassage.map((verse, idx) => {
                return (
                  <p
                    className={cn("text-size-m", styles.verse)}
                    style={{ opacity: opacityForVerses(scrollProgress, idx) }}
                    key={idx}
                  >
                    {verse}
                  </p>
                );
              })}
              {/* <div className={styles.scrollBuffer}>hi</div> */}
            </div>
          )
        : fusionPassage && (
            <div className={styles.fusionWrapper}>
              <div className="text-size-xl">
                {fusionPassage[fusionProgress]}
              </div>
              <div className={cn(styles.fusionButtonsWrapper, "text-size-s")}>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    styles.round,
                    "text-size-s"
                  )}
                  onClick={() => skipWords(false)}
                >
                  <ArrowBack />
                  10
                </button>
                <button
                  className={cn(styles.button, styles.round, "text-size-s")}
                  onClick={toggleResume}
                >
                  {fusionPlay ? "Pause" : "Resume"}
                </button>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    styles.round,
                    "text-size-s"
                  )}
                  onClick={() => skipWords(true)}
                >
                  10
                  <ArrowForward />
                </button>
              </div>
              <div className={cn(styles.fusionButtonsWrapper, "text-size-s")}>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    styles.round,
                    "text-size-s"
                  )}
                  onClick={() => setFusionSpeed(200)}
                >
                  200 ms
                </button>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    styles.round,
                    "text-size-s"
                  )}
                  onClick={() => setFusionSpeed(300)}
                >
                  300 ms
                </button>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    styles.round,
                    "text-size-s"
                  )}
                  onClick={() => setFusionSpeed(400)}
                >
                  400 ms
                </button>
              </div>
            </div>
          )}
    </>
  );
};

export default BiblePassage;

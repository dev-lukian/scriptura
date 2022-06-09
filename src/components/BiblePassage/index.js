import { useEffect, useState, useRef } from "react";
import styles from "./BiblePassage.module.css";

import cn from "classnames";
import { useInView } from "react-intersection-observer";

import demoScripture from "./test.txt";
import ArrowBack from "../../../public/fusion-back.svg";
import ArrowForward from "../../../public/fusion-forward.svg";

const BiblePassage = ({ scrollProgress, method }) => {
  const [normalPassage, setNormalPassage] = useState();
  const [fusionPassage, setFusionPassage] = useState();
  const [fusionPlay, setFusionPlay] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);
  const timer = useRef();

  const opacityForVerses = (sectionProgress, verseNum) => {
    const progress = sectionProgress - verseNum;
    if (progress >= 0 && progress < 1) return 1;
    return 0.3;
  };

  const toggleResume = () => {
    setFusionPlay(!fusionPlay);
    console.log(fusionPlay);
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
        }, 450);
      }
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [fusionPlay]);

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
            <div className={styles.normalWrapper}>
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
                    "text-size-s"
                  )}
                  onClick={() => skipWords(false)}
                >
                  <ArrowBack />
                  10
                </button>
                <button
                  className={cn(styles.button, "text-size-s")}
                  onClick={toggleResume}
                >
                  {fusionPlay ? "Pause" : "Resume"}
                </button>
                <button
                  className={cn(
                    styles.button,
                    styles.lightButton,
                    "text-size-s"
                  )}
                  onClick={() => skipWords(true)}
                >
                  10
                  <ArrowForward />
                </button>
              </div>
            </div>
          )}
    </>
  );
};

export default BiblePassage;

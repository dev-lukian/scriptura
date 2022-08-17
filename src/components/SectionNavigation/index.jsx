import { useState } from 'react';
import cn from 'classnames';
import styles from './SectionNavigation.module.css';

const SectionNavigation = ({ sections, activeSection = 0 }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div className={styles.sectionNavigationWrapper}>
      {sections.map((section, index) => {
        return (
          <div key={index} className={styles.sectionNavigationButtonWrapper}>
            <div
              className={cn(
                styles.sectionNavigationButton,
                activeSection === index && styles.activeSectionNavigationButton
              )}
              onMouseEnter={() => setHoveredButton(index)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => fullpage_api.moveTo(index + 1)}
            ></div>
            {hoveredButton == index && <div className={styles.sectionNavigationText}>{section}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default SectionNavigation;

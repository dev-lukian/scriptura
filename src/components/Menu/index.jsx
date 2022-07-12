import Link from 'next/link';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './Menu.module.css';
import Logo from '../../../public/logo.svg';
import RightChevron from '../../../public/right-chevron.svg';

const menuLinks = [
  { text: 'Read Scripture', path: '/' },
  { text: 'Life is short', path: '/life-is-short' },
];

const Menu = ({ showMenu, setShowMenu, handleMenuClick, onCopy }) => {
  const switchPages = () => {
    setShowMenu(false);
    handleMenuClick();
  };

  return (
    <div className={showMenu ? styles.menuWrapper : styles.hidden}>
      <div>
        <Logo className="lightwayLogo" />
      </div>
      <div className={styles.linksWrapper}>
        {menuLinks.map((link, index) => {
          return (
            <Link key={index} href={link.path}>
              <button className={styles.linkWrapper} onClick={switchPages}>
                <div className="text-size-m">{link.text}</div>
                <div className={styles.chevronWrapper}>
                  <RightChevron className={styles.chevron} />
                </div>
              </button>
            </Link>
          );
        })}
      </div>
      <div>
        <CopyToClipboard text="info@Lightway.com" onCopy={onCopy}>
          <button className={cn('button', 'round', 'text-size-xs')}>info@Lightway.com</button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default Menu;

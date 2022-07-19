import { useRouter } from 'next/router';
import cn from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './Menu.module.css';
import Logo from '../../../public/logo.svg';
import RightChevron from '../../../public/right-chevron.svg';

const menuLinks = [
  { text: 'Read Scripture', path: '/' },
  { text: 'Life is short', path: '/life-is-short' },
];

const Menu = ({ showMenu, handleMenuClick, onCopy }) => {
  const router = useRouter();

  const switchPages = (path) => {
    handleMenuClick();
    router.push(path);
  };

  return (
    <div className={showMenu ? styles.menuWrapper : styles.hidden}>
      <div>
        <Logo className="lightwayLogo" />
      </div>
      <div className={styles.linksWrapper}>
        {menuLinks.map((link, index) => {
          return (
            <button key={index} className={styles.linkWrapper} onClick={() => switchPages(link.path)}>
              <div className="text-size-m">{link.text}</div>
              <div className={styles.chevronWrapper}>
                <RightChevron className={styles.chevron} />
              </div>
            </button>
          );
        })}
      </div>
      <div>
        <CopyToClipboard text="info@scriptura.com" onCopy={onCopy}>
          <button className={cn('button', 'round', 'text-size-xs')}>info@scriptura.com</button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default Menu;

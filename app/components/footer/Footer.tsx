import type {EnhancedMenu} from '~/lib/utils';

import {Link} from '../Link';
import {CountrySelector} from '../CountrySelector';

import {
  customerServicesItems,
  followUsItems,
  infosItems,
} from './FilteredItems';
import DesktopFooter from './DesktopFooter';
import MobileFooter from './MobileFooter';

export default function Footer({menu}: {menu: EnhancedMenu}) {
  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;
  return (
    <>
      <DesktopFooter menu={menu} isFrench={isFrench} />
      <MobileFooter menu={menu} isFrench={isFrench} />
    </>
  );
}

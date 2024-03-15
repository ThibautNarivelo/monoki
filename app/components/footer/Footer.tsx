import type {EnhancedMenu} from '~/lib/utils';

import {Link} from '../Link';
import {CountrySelector} from '../CountrySelector';

import {
  customerServicesItems,
  followUsItems,
  infosItems,
} from './FilteredItems';
import DesktopFooter from './DesktopFooter';

export default function Footer({menu}: {menu: EnhancedMenu}) {
  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;
  return (
    <>
      <DesktopFooter menu={menu} isFrench={isFrench} />
    </>
  );
}

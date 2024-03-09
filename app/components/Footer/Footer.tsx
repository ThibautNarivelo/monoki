import type {EnhancedMenu} from '~/lib/utils';

import {FooterDesktop} from './FooterDesktop/FooterDesktop';

export function Footer({menu}: {menu: EnhancedMenu}) {
  return <FooterDesktop menu={menu} />;
}

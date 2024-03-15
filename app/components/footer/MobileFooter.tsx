import React from 'react';
import {Link} from '@remix-run/react';

import type {EnhancedMenu} from '~/lib/utils';

import {CountrySelector} from '../CountrySelector';

import {followUsItems, infosItems} from './FilteredItems';

export default function DesktopFooter({
  menu,
  isFrench,
}: {
  menu: EnhancedMenu;
  isFrench: boolean;
}) {
  return (
    <div
      className="flex flex-col lg:hidden relative z-30 bg-white w-full h-full px-[1.1rem] pt-[3rem] gap-[5vw]
       justify-start items-center"
    ></div>
  );
}

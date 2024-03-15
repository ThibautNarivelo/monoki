import React from 'react';
import {Link} from '@remix-run/react';

import type {EnhancedMenu} from '~/lib/utils';

import {CountrySelector} from '../CountrySelector';

import {
  customerServicesItems,
  followUsItems,
  infosItems,
} from './FilteredItems';

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
    >
      <div className="flex flex-col h-full">
        <h2 className=" font-switzer text-[4.6rem] uppercase tracking-[-5px] leading-[75px]">
          Join the magic
        </h2>
        <form className="flex flex-col w-full ">
          <input
            type="email"
            placeholder={isFrench ? 'Adresse e-mail' : 'email'}
            className="w-fullh-[40px] bg-white
            placeholder-neutral-400 text-neutral-900 font-switzer"
          />
          <span className="text-[0.6rem] text-neutral-400 font-switzer">
            {isFrench ? '*Champs obligatoires' : '*Required fields.'}
          </span>
          <button
            type="submit"
            className="mt-[1rem] px-[4rem] h-[40px] bg-yellow-500 text-[1rem] font-switzer uppercase tracking-tighter text-neutral-900"
          >
            {isFrench ? 'Continuer' : 'Continue'}
          </button>
        </form>
      </div>

      <div className="hidden relative flex-grow justify-start  gap-[6vw] mt-[.75rem]">
        {/* CATEGORY */}
        {/* FOLLOW US COLUMN */}
        <div className="flex flex-col gap-[2rem]">
          <span className="footerTitle">
            {isFrench ? 'Suivez-nous' : 'Follow us'}
          </span>
          <div className="flex flex-col">
            {menu.items
              .filter((item) => followUsItems.includes(item.title))
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  className="footerLink"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </div>
        {/* CUSTOMER SERVICES COLUMN */}
        <div className="flex flex-col gap-[2rem]">
          <span className="footerTitle">
            {isFrench ? 'Service client' : 'Customer Services'}
          </span>
          <div className="flex flex-col">
            {menu.items
              .filter((item) => customerServicesItems.includes(item.title))
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  className="footerLink"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </div>
        {/* INFOS COLUMN */}
        <div className="flex flex-col gap-[2rem]">
          <span className="footerTitle">
            {isFrench ? 'Service client' : 'Customer Services'}
          </span>
          <div className="flex flex-col">
            {menu.items
              .filter((item) => infosItems.includes(item.title))
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  className="footerLink"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-[2rem] min-w-[5rem] overflow-hidden">
          {
            /* COUNTRY SELECTOR */
            <span className="footerTitle">{isFrench ? 'Pays' : 'Country'}</span>
          }
          <CountrySelector />
        </div>
      </div>
      <h1 className="hidden font-didot uppercase text-[8.5rem] leading-[120px] tracking-[-20px] mt-[1rem]">
        MONOKI
      </h1>
    </div>
  );
}

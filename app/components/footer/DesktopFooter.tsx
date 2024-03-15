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
      className="hidden lg:grid grid-cols-2 relative z-30 bg-white w-full h-[300px] gap-[1rem] px-[1.1rem] pt-[3.5rem]
       justify-between items-end"
    >
      <div className="flex flex-col justify-end items-start w-full gap-[.5rem]  max-w-max">
        <h2 className=" font-switzer text-[5.5rem] uppercase tracking-[-5px] leading-[75px]">
          Join the magic
        </h2>
        <form className="flex w-full gap-[.5rem]">
          <input
            type="email"
            placeholder={isFrench ? 'Adresse e-mail' : 'email'}
            className="w-full flex-1 h-[35px] bg-white
            placeholder-neutral-400 text-neutral-900 font-switzer"
          />
          <button
            type="submit"
            className="px-[3rem] h-[35px] bg-yellow-500 text-[1rem] font-switzer uppercase tracking-tighter text-neutral-900"
          >
            {isFrench ? 'Continuer' : 'Continue'}
          </button>
        </form>
        <span className="text-[0.6rem] text-neutral-400 font-switzer">
          {isFrench ? '*Champs obligatoires' : '*Required fields.'}
        </span>
        <h1 className="font-didot uppercase text-[10.1rem] leading-[140px] tracking-[-20px] mt-[.5rem] ">
          MONOKI
        </h1>
      </div>

      <div className="relative grid grid-cols-4 h-full justify-start items-start pt-2">
        {/* CATEGORY */}
        {/* FOLLOW US COLUMN */}
        <div className="flex flex-col gap-[2rem] ">
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
          <span className="absolute bottom-4 left-0 text-[.6rem] font-switzer">
            © MONOKI {new Date().getFullYear()}. All rights reserved
          </span>
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
    </div>
  );
}

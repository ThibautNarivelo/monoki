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
      className="hidden lg:grid grid-cols-3 relative z-30 bg-white w-full h-[300px] px-[1.1rem] gap-[.5rem] py-[3.5rem]
       justify-between items-start"
    >
      <div className="font-didot uppercase text-[8vw] leading-[6.5vw] tracking-[-20px] ">
        MONOKI
      </div>

      <div className="relative grid grid-cols-3 h-full w-full place-content-start place-items-center">
        {/* CATEGORY */}
        {/* FOLLOW US COLUMN */}
        <div className="flex flex-col h-full gap-[1.5rem]">
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

        {/* INFOS COLUMN */}
        <div className="flex flex-col h-full gap-[1.5rem]">
          <span className="footerTitle">{isFrench ? 'Infos' : 'Infos'}</span>
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
        <div className="flex flex-col h-full gap-[1.5rem] overflow-hidden min-w-[100px]">
          {
            /* COUNTRY SELECTOR */
            <span className="footerTitle">{isFrench ? 'Pays' : 'Country'}</span>
          }
          <CountrySelector />
        </div>
      </div>

      <div className="flex flex-col items-end w-full gap-[.5rem] max-w-min">
        <h2 className=" font-switzer truncate text-[4.8vw] uppercase tracking-[-.35vw] leading-[4vw]">
          Join the magic
        </h2>
        <form className="relative pb-[1.1rem] flex w-full gap-[.5rem]">
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
          <span className="absolute bottom-0 left-0 text-[0.6rem] text-neutral-400 font-switzer">
            {isFrench ? '*Champs obligatoires' : '*Required fields.'}
          </span>
        </form>
      </div>
      <div className="absolute bottom-0 m-[1.1rem] text-[.6rem] font-switzer">
        © MONOKI {new Date().getFullYear()}. All rights reserved
      </div>
    </div>
  );
}

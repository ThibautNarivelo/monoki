import type {EnhancedMenu} from '~/lib/utils';

import {Link} from '../Link';

export default function Footer({menu}: {menu: EnhancedMenu}) {
  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;
  return (
    <div
      className="relative z-30 bg-white w-full h-[315px] px-[1.1rem]
        flex justify-between items-center"
    >
      <div className="flex flex-col">
        <h2 className=" font-switzer text-[4.6rem] uppercase tracking-[-5px] leading-[75px]">
          Join the magic
        </h2>
        <form className="flex gap-[1rem]">
          <input
            type="email"
            placeholder={isFrench ? 'Adresse e-mail' : 'email'}
            className="w-full flex-1 h-[40px] bg-white"
          />
          <button
            type="submit"
            className="px-[2.5rem] h-[40px] bg-yellow-500 text-[1rem] font-switzer uppercase tracking-tighter text-neutral-900"
          >
            {isFrench ? 'Continuer' : 'Continue'}
          </button>
        </form>
        <span className="text-[0.6rem] text-neutral-400 font-switzer">
          {isFrench ? '*Champs obligatoires' : '*Required fields.'}
        </span>
        <h1 className="font-didot uppercase text-[9.375rem] leading-[120px] tracking-[-20px] mt-[2rem]">
          MONOKI
        </h1>
      </div>
      <div className="bg-green-200">
        {menu.items.map((item) => (
          <Link to={item.to} key={item.id}>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

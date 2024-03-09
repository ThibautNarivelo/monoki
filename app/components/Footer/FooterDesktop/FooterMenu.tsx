import {Suspense} from 'react';
import {Disclosure} from '@headlessui/react';

import {pxToRem} from '~/lib/utils';
import type {ChildEnhancedMenuItem, ParentEnhancedMenuItem} from '~/lib/utils';

import {Heading, IconCaret} from '../..';

import {FooterLink} from './FooterLink';

export function FooterMenu({menu}: {menu?: ParentEnhancedMenuItem}) {
  return (
    <div>
      <div
        style={{
          marginBottom: pxToRem(30),
        }}
      >
        <span
          style={{
            fontSize: pxToRem(16),
            fontWeight: 700,
            color: '#171717',
          }}
        >
          {menu?.title}
        </span>
      </div>
      {menu?.items.map((item: ChildEnhancedMenuItem) => {
        return (
          <div
            key={item.title}
            style={{
              color: '#a3a3a3',
              cursor: 'pointer',
            }}
          >
            {item.to ? (
              <FooterLink item={item as ChildEnhancedMenuItem} />
            ) : (
              <span>{item.title}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

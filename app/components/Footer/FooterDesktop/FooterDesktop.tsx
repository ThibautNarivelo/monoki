import {useState} from 'react';

import {pxToRem, useIsHomePath} from '~/lib/utils';
import type {TextInputProps} from '~/components/TextInput';
import type {EnhancedMenu} from '~/lib/utils';

import {Section, Text, TextInput} from '../..';

import {FooterMenu} from '.';

export function FooterDesktop({menu}: {menu: EnhancedMenu}) {
  const [email, setEmail] = useState<string>();
  const {items} = menu;
  const isHome = useIsHomePath();

  const handleChange: TextInputProps['onChange'] = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      display="flex"
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '50%',
          }}
        >
          <Text
            size="lead"
            style={{
              fontSize: pxToRem(70),
              width: '100%',
            }}
          >
            JOIN THE MAGIC
          </Text>
          <TextInput
            value={email}
            onChange={handleChange}
            withAction
            onAction={() => {
              console.log('lkaka');
            }}
          />
          <div>Should be MONOKI logo</div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '40%',
            justifyContent: 'space-between',
          }}
        >
          {items.map((v) => (
            <FooterMenu key={v.title} menu={v} />
          ))}
        </div>
      </div>
    </Section>
  );
}

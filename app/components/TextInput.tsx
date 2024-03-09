import React from 'react';

import {pxToRem} from '~/lib/utils';

export interface TextInputProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
  withAction?: boolean;
  onAction?: () => void;
}

export function TextInput({
  onChange,
  value,
  helperText,
  onAction,
  placeholder,
  withAction,
}: TextInputProps) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '25px',
          maxWidth: '500px',
        }}
      >
        <input
          style={{
            borderRadius: '2px',
            justifyContent: 'space-between',
            border: '1px solid #acacac',
            width: '100%',
          }}
          value={value}
          onChange={onChange}
        />
        {withAction && (
          <button
            style={{
              height: '25px',
              backgroundColor: '#EAB308',
              borderRadius: '2px',
              fontSize: '13px',
              padding: `0px ${pxToRem(10)}`,
            }}
            onClick={onAction}
          >
            Continuer
          </button>
        )}
      </div>
      {helperText && <span>{helperText}</span>}
    </div>
  );
}

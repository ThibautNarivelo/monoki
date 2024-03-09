import type {CodegenConfig} from '@graphql-codegen/cli';
import {preset, pluckConfig, schema} from '@shopify/hydrogen-codegen';

export default {
  overwrite: true,
  pluckConfig,
  generates: {
    'storefrontapi.generated.d.ts': {
      schema,
      preset,
      documents: ['storefront-graphql.{ts,tsx}', 'server.ts'],
    },
    // 'customer-account.generated.d.ts': {
    //   schema,
    //   preset,
    //   documents: ['customer-account-graphql.{ts,tsx}', 'server.ts'],
    // },
  },
} as CodegenConfig;

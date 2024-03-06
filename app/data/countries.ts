import type {Localizations} from '~/lib/type';

export const countries: Localizations = {
  default: {
    label: 'France (EUR €)',
    language: 'FR',
    country: 'FR',
    currency: 'EUR',
  },
  '/en-us': {
    label: 'United States (USD $)',
    language: 'EN',
    country: 'US',
    currency: 'USD',
  },
};

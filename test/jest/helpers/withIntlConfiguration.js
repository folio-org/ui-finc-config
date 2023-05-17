import React from 'react';
import { IntlProvider } from 'react-intl';
import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import stripesSmartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';
import localTranslations from '../../../translations/ui-finc-config/en';

const translationSets = [
  {
    prefix: 'ui-finc-config',
    translations: localTranslations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: stripesSmartComponentsTranslations,
  },
];


function withIntlConfiguration(children) {
  const allTranslations = {};

  translationSets.forEach((set) => {
    const { prefix, translations } = set;
    Object.keys(translations).forEach(key => {
      allTranslations[`${prefix}.${key}`] = translations[key];
    });
  });

  return (
    <IntlProvider locale="en-US" messages={allTranslations}>
      {children}
    </IntlProvider>
  );
}


export default withIntlConfiguration;

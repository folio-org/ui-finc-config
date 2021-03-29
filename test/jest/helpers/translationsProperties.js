import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import stripesSmartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';

import translations from '../../../translations/ui-finc-config/en';

const translationsProperties = [
  {
    prefix: 'ui-finc-config',
    translations,
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

export default translationsProperties;

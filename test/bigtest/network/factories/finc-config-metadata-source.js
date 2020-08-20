import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'SOURCE ' + i,
  description: (i) => 'description' + i,
  status: 'Active',
  organization: {
    id: '',
    name: ''
  },
  contacts: [],
  indexingLevel: '',
  generalNotes: '',
  lastProcessed: '',
  tickets: [],
  accessUrl: '',
  sourceId: 1,
  solrShard: '',
  deliveryMethods: [],
  formats: [],
  updateRhythm: '',
  inferiorTo: [],
  selectedBy: [],
});

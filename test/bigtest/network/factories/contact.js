import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  externalId: () => faker.random.uuid(),
  name: (i) => 'CONTACT ' + i,
});

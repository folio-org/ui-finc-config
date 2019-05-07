import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SourceInteractor from '../interactors/source';

describe('Metadata Source', () => {
  setupApplication();

  const sourceInteractor = new SourceInteractor();

  beforeEach(async function () {
    this.server.createList('metadata-source', 25);
    this.visit('/fincconfig/metadatasources?filters=status.Active');

    await sourceInteractor.clickActiveSOURCEsCheckbox();
  });

  it('shows the list of source items', () => {
    expect(sourceInteractor.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(sourceInteractor.instances().length).to.be.gte(5);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await sourceInteractor.instances(0).click();
    });

    it('loads the instance details', function () {
      expect(sourceInteractor.instance.isVisible).to.equal(true);
    });
  });
});

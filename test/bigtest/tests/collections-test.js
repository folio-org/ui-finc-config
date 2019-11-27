import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import CollectionInteractor from '../interactors/collection';

const COLLECTION_COUNT = 25;

describe('Metadata Collection', () => {
  setupApplication();

  const collectionInteractor = new CollectionInteractor();

  beforeEach(async function () {
    this.server.createList('finc-config-metadata-collection', COLLECTION_COUNT);
    this.visit('/finc-config/metadata-collections?filters=metadataAvailable.Yes');
    await collectionInteractor.whenLoaded();

    // click checkbox not working always
    // await collectionInteractor.clickMetadataAvailableCOLLECTIONsCheckbox();
  });

  it('shows the list of collection items', () => {
    expect(collectionInteractor.isVisible).to.equal(true);
  });

  it('renders each collection-instance', () => {
    expect(collectionInteractor.instances().length).to.be.equal(COLLECTION_COUNT);
  });

  describe('clicking on the first collection', function () {
    beforeEach(async function () {
      await collectionInteractor.instances(0).click();
    });

    it('loads the collection-instance details', function () {
      expect(collectionInteractor.instance.isVisible).to.equal(true);
    });
  });
});

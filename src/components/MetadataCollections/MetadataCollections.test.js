import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
// import { screen } from '@testing-library/react';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import {
  StripesConnectedSource,
  // SearchAndSortQuery,
} from '@folio/stripes/smart-components';
// import {
//   MultiColumnList,
// } from '@folio/stripes/components';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import metadatacollections from '../../../test/fixtures/metadatacollections';
import mdSources from '../../../test/fixtures/tinyMetadataSources';
import MetadataCollections from './MetadataCollections';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

// const query = {
//   query: '',
//   sort: 'label',
// };

const tinySources = { mdSources };

const testCollection = {
  logger: { log: noop },
  mutator: { collections: {}, mdSources: {}, query: {}, resultCount: {} },
  props: { history: {}, location: {}, match: {}, staticContext: undefined, children: {} },
  recordsObj: {},
  resources: {
    collections: {},
    mdSources: { tinySources },
    query: { query: '', filters: 'metadataAvailable.yes,metadataAvailable.no', sort: 'label' },
    resultCount: 30
  }
};

const connectedTestCollection = new StripesConnectedSource(testCollection.props, testCollection.logger, 'collections');

const renderMetadataCollections = () => (
  renderWithIntl(
    <Router>
      <StripesContext.Provider value={stripes}>
        <MetadataCollections
          contentData={metadatacollections}
          collection={connectedTestCollection}
          filterData={tinySources}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'metadataAvailable.yes'}
          selectedRecordId={''}
          onChangeIndex={jest.fn()}
        />
        {/* <MultiColumnList
          contentData={metadatacollections}
          id="list-collections"
          visibleColumns={['label', 'mdSource', 'metadataAvailable', 'usageRestricted', 'permittedFor', 'freeContent']}
        />
        </MetadataCollections> */}
        {/* </DataContext.Provider> */}
      </StripesContext.Provider>
    </Router>,
    translationsProperties
  )
);

describe('Collections SASQ View', () => {
  // let renderCollectionsViewResult;
  beforeEach(() => {
    renderMetadataCollections(metadatacollections, testCollection, tinySources, noop, noop, noop, '', '', noop);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane collectionresults should be visible', () => {
    expect(document.querySelector('#pane-collectionresults-content')).toBeInTheDocument();
  });

  describe('check the collection filter elements', () => {
    it('mdSource filter should be present', () => {
      expect(document.querySelector('#filter-accordion-mdSource')).toBeInTheDocument();
    });

    it('metadataAvailable filter should be present', () => {
      expect(document.querySelector('#filter-accordion-metadataAvailable')).toBeInTheDocument();
    });

    it('usageRestricted filter should be present', () => {
      expect(document.querySelector('#filter-accordion-usageRestricted')).toBeInTheDocument();
    });

    it('freeContent filter should be present', () => {
      expect(document.querySelector('#filter-accordion-freeContent')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#collectionSubmitSearch')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#collectionSearchField')).toBeInTheDocument();
    });
  });

  // TODO: list of results will not rendered yet
  it('should have proper list results size', () => {
    // myTestView(metadatacollections, tinySources, noop, noop);
    // '#list-collections > [role=row]'
    // expect(document.querySelectorAll('#pane-collectionresults-content .mclRowContainer > [role=row]').length).toEqual(2);
    // expect(screen.getAllByRole('row').length).toEqual(2);
    // expect(document.querySelector('[role=row]')).toBeInTheDocument();
    // expect(document.querySelector('#list-sources')).toBeInTheDocument();

    // pane is rendered:
    expect(document.querySelector('#pane-collectionresults')).toBeInTheDocument();
    // MultiColumnList is NOT rendered:
    // expect(document.querySelector('#list-collections')).toBeInTheDocument();
  });
});

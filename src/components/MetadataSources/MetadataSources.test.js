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
import metadatasources from '../../../test/fixtures/metadatasources';
import MetadataSources from './MetadataSources';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';

// const query = {
//   query: '',
//   sort: 'label',
// };

const filterData = { contacts: [
  {
    'externalId': 'fcfaca0b-12e7-467e-b503-d44a44d60a62',
    'name': 'Doe, John',
  },
  {
    'externalId': '01771c0a-a890-4488-b5e9-366aa697bd93',
    'name': 'Doe, Jane',
  }
] };

const testSource = {
  logger: { log: noop },
  mutator: { sources: {}, query: {}, resultCount: {} },
  props: { history: {}, location: {}, match: {}, staticContext: undefined, children: {} },
  recordsObj: {},
  resources: {
    sources: {},
    query: { query: '', filters: 'status.active,status.implementation', sort: 'label' },
    resultCount: 30
  }
};

const connectedTestSource = new StripesConnectedSource(testSource.props, testSource.logger, 'sources');

const renderMetadataSources = () => (
  renderWithIntl(
    <Router>
      <StripesContext.Provider value={stripes}>
        <MetadataSources
          contentData={metadatasources}
          source={connectedTestSource}
          filterData={filterData}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'metadataAvailable.yes'}
          selectedRecordId={''}
          onChangeIndex={jest.fn()}
        />
      </StripesContext.Provider>
    </Router>,
    translationsProperties
  )
);

describe('Sources SASQ View', () => {
  beforeEach(() => {
    renderMetadataSources(metadatasources, testSource, noop, noop, noop, '', '', noop);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane sourceresults should be visible', () => {
    expect(document.querySelector('#pane-sourceresults-content')).toBeInTheDocument();
  });

  describe('check the source filter elements', () => {
    it('contact filter should be present', () => {
      expect(document.querySelector('#filter-accordion-contact')).toBeInTheDocument();
    });

    it('status filter should be present', () => {
      expect(document.querySelector('#filter-accordion-status')).toBeInTheDocument();
    });

    it('solrShard filter should be present', () => {
      expect(document.querySelector('#filter-accordion-solrShard')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#sourceSubmitSearch')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#sourceSearchField')).toBeInTheDocument();
    });
  });

  // TODO: list of results will not rendered yet
  it('should have proper list results size', () => {
    // pane is rendered:
    expect(document.querySelector('#pane-sourceresults')).toBeInTheDocument();
    // MultiColumnList is NOT rendered:
    // expect(document.querySelector('#list-sources')).toBeInTheDocument();
  });
});

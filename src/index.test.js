import { noop } from 'lodash';
import React from 'react';
import { Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionsRoute from './routes/CollectionsRoute';
import SourcesRoute from './routes/SourcesRoute';
import SourceCreateRoute from './routes/SourceCreateRoute';
import CollectionCreateRoute from './routes/CollectionCreateRoute';
import CollectionEditRoute from './routes/CollectionEditRoute';
import SourceEditRoute from './routes/SourceEditRoute';
import collections from '../test/fixtures/metadatacollections';
import sources from '../test/fixtures/metadatasources';
import collection from '../test/fixtures/metadatacollection';
import source from '../test/fixtures/metadatasource';

// const fakePathMap = {
//   '/metadata-sources': SourcesRoute,
//   '/metadata-sources/create': SourceCreateRoute,
//   undefined: NoMatch
// };

// const showSettings = true;

// const renderFincConfig = () => {
//   const history = createMemoryHistory();
//   return { ...renderWithIntl(
//     <Router history={history}>
//       <FincConfig
//         match={match}
//         showSettings={showSettings}
//       />
//     </Router>,
//   ) };
// };

const routeProps = {
  history: {
    push: () => jest.fn()
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    },
  },
  location: {},
  mutator: {
    query: { update: noop },
  },
  resources: { collections, sources }
};

const createRouteProps = {
  history: {
    push: () => jest.fn()
  },
  location: {
    search: '',
  },
  mutator: {
    collections: { POST: jest.fn().mockReturnValue(Promise.resolve()) },
    sources: { POST: jest.fn().mockReturnValue(Promise.resolve()) },
  },
};

const editRouteProps = {
  history: {
    push: () => jest.fn()
  },
  location: {
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    }
  },
  resources: {
    collection: { collection },
    source: { source },
  },
};

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return {
    ...renderWithIntl(
      <Router history={history}>
        {component}
      </Router>
    )
  };
};

it('should render CollectionsRoute', () => {
  const renderComponent = renderWithRouter(<CollectionsRoute {...routeProps} />);

  const { getByTestId } = renderComponent;
  expect(getByTestId('collections')).toBeInTheDocument();
  expect(screen.getByText('Metadata collections')).toBeInTheDocument();
});

it('should render SourcesRoute', () => {
  const renderComponent = renderWithRouter(<SourcesRoute {...routeProps} />);

  const { getByTestId } = renderComponent;
  expect(getByTestId('sources')).toBeInTheDocument();
  expect(screen.getByText('Metadata sources')).toBeInTheDocument();
});

it('should render SourceCreateRoute', () => {
  renderWithRouter(<SourceCreateRoute {...createRouteProps} />);

  expect(document.querySelector('#form-source')).toBeInTheDocument();
  expect(screen.getByText('Create')).toBeInTheDocument();
});

it('should render CollectionCreateRoute', () => {
  renderWithRouter(<CollectionCreateRoute {...createRouteProps} />);

  expect(document.querySelector('#form-collection')).toBeInTheDocument();
  expect(screen.getByText('Create')).toBeInTheDocument();
});

it('should render SourceEditRoute', () => {
  renderWithRouter(<SourceEditRoute {...editRouteProps} />);

  expect(document.querySelector('#form-source')).toBeInTheDocument();
  // expect(screen.getByText('Cambridge University Press Journals')).toBeInTheDocument();
});

it('should render CollectionEditRoute', () => {
  renderWithRouter(<CollectionEditRoute {...editRouteProps} />);

  expect(document.querySelector('#form-collection')).toBeInTheDocument();
  // expect(screen.getByText('21st Century Political Science Association')).toBeInTheDocument();
});

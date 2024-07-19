import { noop } from 'lodash';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import withIntlConfiguration from '../test/jest/helpers/withIntlConfiguration';
import CollectionsRoute from './routes/CollectionsRoute';
import SourcesRoute from './routes/SourcesRoute';
import SourceCreateRoute from './routes/SourceCreateRoute';
import CollectionCreateRoute from './routes/CollectionCreateRoute';
import CollectionEditRoute from './routes/CollectionEditRoute';
import SourceEditRoute from './routes/SourceEditRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import collections from '../test/fixtures/metadatacollections';
import sources from '../test/fixtures/metadatasources';
import FincConfig from './index';

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
};

const viewRouteProps = {
  history: {
    action: 'PUSH',
    block: jest.fn(),
    createHref: jest.fn(),
    go: jest.fn(),
    listen: jest.fn(),
    location: {
      hash: '',
      pathname: '',
      search: '',
    },
    push: () => jest.fn(),
    replace: () => jest.fn(),
  },
  location: {
    hash: '',
    pathname: '',
    search: '',
  },
  match: {
    params: {
      id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
    }
  },
};

const match = {
  isExact: false,
  params: {},
  path: '/finc-config',
  url: '/finc-config',
};

const queryClient = new QueryClient();

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return {
    ...render(withIntlConfiguration(
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          {component}
        </Router>
      </QueryClientProvider>
    ))
  };
};

jest.unmock('react-intl');

jest.mock('./index', () => {
  return () => <span>FincConfig</span>;
});

useOkapiKy.mockReturnValue({
  get: jest.fn(() => ({ json: () => jest.fn() }))
});

it('should render CollectionsRoute', () => {
  renderWithRouter(<CollectionsRoute {...routeProps} />);

  expect(screen.getByTestId('collections')).toBeInTheDocument();
  expect(screen.getByText('Metadata collections')).toBeInTheDocument();
});

it('should render SourcesRoute', () => {
  renderWithRouter(<SourcesRoute {...routeProps} />);

  expect(screen.getByTestId('sources')).toBeInTheDocument();
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

it('should render SourceEditRoute', async () => {
  renderWithRouter(<SourceEditRoute {...editRouteProps} />);
  await waitFor(() => expect(document.querySelector('#form-source')).toBeInTheDocument());
});

it('should render CollectionEditRoute', async () => {
  renderWithRouter(<CollectionEditRoute {...editRouteProps} />);
  await waitFor(() => expect(document.querySelector('#form-collection')).toBeInTheDocument());
});

it('should render SourceViewRoute', async () => {
  renderWithRouter(<SourceViewRoute {...viewRouteProps} />);

  await waitFor(() => expect(document.querySelector('#pane-sourcedetails')).toBeInTheDocument());
});

it('should render CollectionViewRoute', async () => {
  renderWithRouter(<CollectionViewRoute {...viewRouteProps} />);

  await waitFor(() => expect(document.querySelector('#pane-collectiondetails')).toBeInTheDocument());
});

describe('Application root', () => {
  it('should render without crashing', () => {
    renderWithRouter(<FincConfig match={match} />);

    expect(screen.getByText('FincConfig')).toBeInTheDocument();
  });
});

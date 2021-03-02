import { noop } from 'lodash';
import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers';
import FincConfig from './index';
import CollectionsRoute from './routes/CollectionsRoute';
import SourcesRoute from './routes/SourcesRoute';
import collections from '../test/fixtures/metadatacollections';

// const SourcesRoute = jest.fn();
// const SourceCreateRoute = jest.fn();
// const NoMatch = jest.fn();

// const fakePathMap = {
//   '/metadata-sources': SourcesRoute,
//   '/metadata-sources/create': SourceCreateRoute,
//   undefined: NoMatch
// };

// const routeProps = {
//   history: {
//     push: () => jest.fn()
//   },
//   match: {
//     path: 'finc-config/',
//   },
//   showSettings: true,
//   location: {},
//   mutator: {
//     query: { update: noop },
//   },
// };

// const match = {
//   match: {
//     path: 'finc-config/',
//     params: {
//       id: '9a2427cd-4110-4bd9-b6f9-e3475631bbac',
//     },
//   },
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
  resources: { collections }
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

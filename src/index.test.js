import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import FincConfig from './index';

jest.mock('./routes/CollectionCreateRoute', () => () => <div>CollectionCreateRoute</div>);
jest.mock('./routes/CollectionEditRoute', () => () => <div>CollectionEditRoute</div>);
jest.mock('./routes/CollectionsRoute', () => ({ children }) => (
  <div>CollectionsRoute {children}</div>
));
jest.mock('./routes/CollectionViewRoute', () => () => <div>CollectionViewRoute</div>);
jest.mock('./routes/SourceCreateRoute', () => () => <div>SourceCreateRoute</div>);
jest.mock('./routes/SourceEditRoute', () => () => <div>SourceEditRoute</div>);
jest.mock('./routes/SourcesRoute', () => ({ children }) => (
  <div>SourcesRoute {children}</div>
));
jest.mock('./routes/SourceViewRoute', () => () => <div>SourceViewRoute</div>);
jest.mock('./settings', () => () => <div>Settings</div>);

const match = {
  isExact: false,
  params: {},
  path: '/finc-config',
  url: '/finc-config',
};

const renderComponent = (showSettings, testPath) => render(
  <MemoryRouter initialEntries={[testPath]}>
    <FincConfig
      location={{}}
      match={match}
      showSettings={showSettings}
      stripes={{}}
    />
  </MemoryRouter>
);

describe('render FincConfig settings', () => {
  it('should render <Settings> when showSettings is true', () => {
    renderComponent(true, '/finc-config');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should not render <Settings> when showSettings is false', () => {
    renderComponent(false, '/finc-config');
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});

describe('render FincConfig routes', () => {
  it('should render <SourceCreateRoute>', () => {
    renderComponent(false, '/finc-config/metadata-sources/create');
    expect(screen.getByText('SourceCreateRoute')).toBeInTheDocument();
  });

  it('should render <SourceEditRoute>', () => {
    renderComponent(false, '/finc-config/metadata-sources/50304b4b-cca1-49a8-8caa-318f0a07efa4/edit');
    expect(screen.getByText('SourceEditRoute')).toBeInTheDocument();
  });

  it('should render <SourcesRoute> and <SourceViewRoute>', () => {
    renderComponent(false, '/finc-config/metadata-sources/50304b4b-cca1-49a8-8caa-318f0a07efa4');
    expect(screen.getByText('SourcesRoute')).toBeInTheDocument();
    expect(screen.getByText('SourceViewRoute')).toBeInTheDocument();
  });

  it('should render <CollectionCreateRoute>', () => {
    renderComponent(false, '/finc-config/metadata-collections/create');
    expect(screen.getByText('CollectionCreateRoute')).toBeInTheDocument();
  });

  it('should render <CollectionEditRoute>', () => {
    renderComponent(false, '/finc-config/metadata-collections/50304b4b-cca1-49a8-8caa-318f0a07efa4/edit');
    expect(screen.getByText('CollectionEditRoute')).toBeInTheDocument();
  });

  it('should render <CollectionsRoute> and <CollectionViewRoute>', () => {
    renderComponent(false, '/finc-config/metadata-collections/50304b4b-cca1-49a8-8caa-318f0a07efa4');
    expect(screen.getByText('CollectionsRoute')).toBeInTheDocument();
    expect(screen.getByText('CollectionViewRoute')).toBeInTheDocument();
  });
});

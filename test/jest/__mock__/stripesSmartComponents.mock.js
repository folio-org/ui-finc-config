import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  LocationLookup: () => <div>LocationLookup</div>,
  ViewMetaData: () => <div>ViewMetaData</div>,
  StripesConnectedSource: (props, logger, resourceName) => ({
    fetchMore: jest.fn(val => val),
    totalCount: () => props?.resources?.[resourceName]?.other?.totalRecords ?? undefined,
    update: jest.fn(),
    loaded: jest.fn(),
    records: () => props?.resources?.[resourceName]?.records ?? []
  }),
  ControlledVocab: jest.fn(({
    label,
  }) => (
    <>
      <span>{label}</span>
    </>
  )),
  Settings: jest.fn(({
    pages,
    paneTitle,
  }) => (
    <>
      <span>{paneTitle}</span>
      <span>{pages[0].route}</span>
      <span>{pages[0].label}</span>
    </>
  )),
}), { virtual: true });

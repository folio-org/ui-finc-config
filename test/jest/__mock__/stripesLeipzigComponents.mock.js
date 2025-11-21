jest.mock('@folio/stripes-leipzig-components', () => ({
  useOkapiKyMutation: jest.fn(() => ({
    useCreate: jest.fn(() => ({
      mutate: jest.fn(),
      isLoading: false,
    })),
    useUpdate: jest.fn(() => ({
      mutate: jest.fn(),
      isLoading: false,
    })),
    useDelete: jest.fn(() => ({
      mutate: jest.fn(),
      isLoading: false,
    })),
  })),
  useOkapiKyQuery: jest.fn(() => ({
    get: jest.fn(),
    isLoading: false,
  })),
}));

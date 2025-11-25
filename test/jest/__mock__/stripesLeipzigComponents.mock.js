jest.mock('@folio/stripes-leipzig-components', () => ({
  EditCard: ({ children, header, onDelete, deleteButtonTooltipText }) => (
    <div>
      <h3>{header}</h3>
      <button
        aria-label={deleteButtonTooltipText}
        onClick={onDelete}
      >
        Delete
      </button>
      {children}
    </div>
  ),
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

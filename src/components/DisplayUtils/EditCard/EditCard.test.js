import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntlConfiguration from '../../../../test/jest/helpers/renderWithIntlConfiguration';
import EditCard from './EditCard';

const onDelete = jest.fn();
const children = 'children';

describe('EditCard', () => {
  beforeEach(() => {
    renderWithIntlConfiguration(
      <EditCard
        deleteButtonTooltipText="Remove card"
        header="Card #1"
        onDelete={onDelete}
      >
        {children}
      </EditCard>
    );
  });

  test('renders the EditCard component', () => {
    expect(screen.getByRole('button', { name: 'Remove card' })).toBeInTheDocument();
    expect(screen.getByText('Card #1')).toBeInTheDocument();
  });

  test('renders the child component', () => {
    expect(screen.getByText('children')).toBeInTheDocument();
  });

  test('if onDelete function will be called', async () => {
    const deleteButton = screen.getByLabelText('delete-contact');
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    await expect(onDelete).toHaveBeenCalled();
  });
});

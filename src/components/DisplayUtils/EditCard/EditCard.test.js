import { StaticRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import withIntlConfiguration from '../../../../test/jest/helpers/withIntlConfiguration';
import EditCard from './EditCard';

const onDelete = jest.fn();
const children = 'children';

describe('EditCard', () => {
  beforeEach(() => {
    render(withIntlConfiguration(
      <StaticRouter>
        <EditCard
          deleteButtonTooltipText="Remove card"
          header="Card #1"
          onDelete={onDelete}
        >
          {children}
        </EditCard>
      </StaticRouter>
    ));
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

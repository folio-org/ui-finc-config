import { StaticRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import withIntlConfiguration from '../../../../../../test/jest/helpers/withIntlConfiguration';
import EditCard from './EditCard';

const onDelete = jest.fn();

const props = {
  children: 'children',
  deleteButtonTooltipText: 'Remove contact',
  header: 'Contact #1',
  onDelete
};

describe('EditCard', () => {
  beforeEach(() => {
    render(withIntlConfiguration(
      <StaticRouter>
        <EditCard
          {...props}
        />
      </StaticRouter>
    ));
  });

  test('renders the EditCard component', async () => {
    expect(screen.getByRole('button', { name: 'Remove contact' })).toBeInTheDocument();
    expect(screen.getByText('Contact #1')).toBeInTheDocument();
  });
});

import { Form } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import RepeatableField from './RepeatableField';

function createMockFields(initialCount = 1) {
  let fields = Array.from({ length: initialCount }, (_, i) => `field${i}`);
  return {
    map: (cb) => fields.map((name, i) => cb(name, i)),
    remove: jest.fn((index) => fields.splice(index, 1)),
    push: jest.fn(() => {
      const newName = `field${fields.length}`;
      fields.push(newName);
      return newName;
    }),
    getFields: () => fields,
    reset: (count = 1) => { fields = Array.from({ length: count }, (_, i) => `field${i}`); },
  };
}

const urlValidate = value => (/^https?:\/\//.test(value) ? undefined : 'Invalid URL');

const renderRepeatableField = (mockFields, fieldValidate, isRequired) => render(
  <Form
    onSubmit={() => {}}
    render={() => (
      <RepeatableField
        ariaLabel="Test"
        fields={mockFields}
        fieldValidate={fieldValidate}
        isFirstFieldRequired={isRequired}
        placeholder="Enter value"
      />
    )}
  />
);

describe('RepeatableField', () => {
  it('renders fields and add button', () => {
    renderRepeatableField(createMockFields(1), () => {}, false);

    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
    expect(screen.getByText(/add/i)).toBeInTheDocument();
  });

  it('shows required error only occures once for the first field', async () => {
    const generatedMockFields = createMockFields(2);
    renderRepeatableField(generatedMockFields, urlValidate, true);

    const inputs = screen.getAllByPlaceholderText('Enter value');
    await userEvent.click(inputs[0]);
    await userEvent.tab();

    expect(screen.getByText(/Required/i)).toBeInTheDocument();

    await userEvent.click(inputs[1]);
    await userEvent.tab();
    // eslint-disable-next-line
    expect(screen.getAllByText(/Required/i)).toHaveLength(1);
  });

  it('shows url error for invalid input', async () => {
    renderRepeatableField(createMockFields(1), urlValidate, false);

    const input = screen.getAllByPlaceholderText('Enter value')[0];
    await userEvent.type(input, 'foo');
    await userEvent.tab();

    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });
});

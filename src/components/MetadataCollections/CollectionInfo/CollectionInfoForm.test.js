import React from 'react';
import { Form } from 'react-final-form';
import { BrowserRouter as Router } from 'react-router-dom';
// import { screen } from '@testing-library/react';
// import { userEvent } from '@testing-library/user-event';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers';
import CollectionInfoForm from './CollectionInfoForm';
import COLLECTION from '../../../../test/fixtures/metadatacollection';

const onSubmit = jest.fn();
const renderCollectionInfoForm = (metadataCollection = COLLECTION) => (
  renderWithIntl(
    <Router>
      <Form
        onSubmit={onSubmit}
        render={() => (
          <CollectionInfoForm accordionId="editCollectionInfo" initialValues={metadataCollection} />
        )}
      />
    </Router>
  )
);

describe('CollectionInfoForm', () => {
  test('should display accordion', () => {
    renderCollectionInfoForm();
    expect(document.querySelector('#editCollectionInfo')).toBeInTheDocument();
    // userEvent.click(screen.getByText('Save & close'));
    // expect(getAllByText('Required!')).toHaveLength(1);
  });

  test('should display all fields', () => {
    renderCollectionInfoForm();
    expect(document.querySelector('#addcollection_label')).toBeInTheDocument();
    expect(document.querySelector('#addcollection_description')).toBeInTheDocument();
    expect(document.querySelector('#addcollection_mdSource')).toBeInTheDocument();
  });
});

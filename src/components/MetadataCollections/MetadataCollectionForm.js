import { isEqual } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import FormContainer from '../DisplayUtils/FormContainer';
import CollectionInfoForm from './CollectionInfo/CollectionInfoForm';
import CollectionManagementForm from './CollectionManagement/CollectionManagementForm';
import CollectionTechnicalForm from './CollectionTechnical/CollectionTechnicalForm';

const formConfig = {
  formId: 'form-collection',
  testIdPrefix: 'collection',
  deletePermission: 'finc-config.metadata-collections.item.delete',
  accordionComponents: [
    { Component: CollectionInfoForm, id: 'editCollectionInfo' },
    { Component: CollectionManagementForm, id: 'editCollectionManagement' },
    { Component: CollectionTechnicalForm, id: 'editCollectionTechnical' },
  ],
};

const WrappedForm = (props) => <FormContainer {...props} {...formConfig} />;

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  enableReinitialize: true,
  navigationCheck: true,
})(WrappedForm);

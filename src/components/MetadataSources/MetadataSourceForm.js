import { isEqual } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import FormContainer from '../DisplayUtils/FormContainer';
import SourceInfoForm from './SourceInfo/SourceInfoForm';
import SourceManagementForm from './SourceManagement/SourceManagementForm';
import SourceTechnicalForm from './SourceTechnical/SourceTechnicalForm';

const formConfig = {
  formId: 'form-source',
  testIdPrefix: 'source',
  deletePermission: 'ui-finc-config.delete',
  accordionComponents: [
    { Component: SourceInfoForm, id: 'editSourceInfo' },
    { Component: SourceManagementForm, id: 'editSourceManagement' },
    { Component: SourceTechnicalForm, id: 'editSourceTechnical' },
  ],
};

const WrappedForm = (props) => <FormContainer {...props} {...formConfig} />;

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  enableReinitialize: true,
  navigationCheck: true,
})(WrappedForm);

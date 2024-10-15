import { useState } from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneFooter,
  PaneHeader,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import SourceInfoForm from './SourceInfo/SourceInfoForm';
import SourceManagementForm from './SourceManagement/SourceManagementForm';
import SourceTechnicalForm from './SourceTechnical/SourceTechnicalForm';
import BasicStyle from '../BasicStyle.css';

const MetadataSourceForm = ({
  handlers: { onClose },
  handleSubmit,
  initialValues = {},
  invalid,
  isLoading,
  onDelete,
  pristine,
  submitting,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [accordionsState, setAccordionsState] = useState({
    editSourceInfo: true,
    editSourceManagement: true,
    editSourceTechnical: true
  });

  const handleExpandAll = (obj) => {
    setAccordionsState(obj);
  };

  const handleAccordionToggle = ({ id }) => {
    setAccordionsState({ ...accordionsState, [id]: !accordionsState[id] });
  };

  const doBeginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (!confirmation) {
      setConfirmDelete(false);
    }
  };

  const getFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-finc-config.form.close">
          { ([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-closesourcedialog"
              onClick={onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const getLastMenu = () => {
    const isEditing = initialValues?.id;

    return (
      <PaneMenu>
        {isEditing && (
          <IfPermission perm="finc-config.metadata-sources.item.delete">
            <Button
              buttonStyle="danger"
              disabled={confirmDelete}
              id="clickable-delete-source"
              marginBottom0
              onClick={doBeginDelete}
              title="delete"
            >
              <FormattedMessage id="ui-finc-config.form.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  };

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-source-form-cancel-button
        id="clickable-close-source-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-config.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-source-form-submit-button
        disabled={disabled}
        id="clickable-savesource"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  };

  const renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={getFirstMenu()}
      lastMenu={getLastMenu()}
      paneTitle={initialValues.id ? initialValues.label : <FormattedMessage id="ui-finc-config.form.create" />}
    />
  );

  const footer = getPaneFooter();
  const name = initialValues.label;

  if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

  return (
    <form
      className={BasicStyle.styleForFormRoot}
      data-test-source-form-page
      id="form-source"
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={footer}
          renderHeader={renderFormPaneHeader}
        >
          <div className={BasicStyle.styleForFormContent}>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={accordionsState}
                    onToggle={handleExpandAll}
                    setStatus={null}
                  />
                </Col>
              </Row>
              {initialValues.metadata?.createdDate && (
                <ViewMetaData metadata={initialValues.metadata} />
              )}
              <SourceInfoForm
                accordionId="editSourceInfo"
                expanded={accordionsState.editSourceInfo}
                onToggle={handleAccordionToggle}
              />
              <SourceManagementForm
                accordionId="editSourceManagement"
                expanded={accordionsState.editSourceManagement}
                onToggle={handleAccordionToggle}
                initialValues={initialValues}
              />
              <SourceTechnicalForm
                accordionId="editSourceTechnical"
                expanded={accordionsState.editSourceTechnical}
                onToggle={handleAccordionToggle}
              />
            </AccordionSet>
            <ConfirmationModal
              heading={<FormattedMessage id="ui-finc-config.form.delete" />}
              id="delete-source-confirmation"
              message={<FormattedMessage
                id="ui-finc-config.form.delete.confirm.message"
                values={{ name }}
              />}
              onCancel={() => { doConfirmDelete(false); }}
              onConfirm={() => onDelete()}
              open={confirmDelete}
            />
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

MetadataSourceForm.propTypes = {
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  // set navigationCheck true for confirming changes
  navigationCheck: true,
})(MetadataSourceForm);

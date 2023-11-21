import React, { useState } from 'react';
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

import CollectionInfoForm from './CollectionInfo/CollectionInfoForm';
import CollectionManagementForm from './CollectionManagement/CollectionManagementForm';
import CollectionTechnicalForm from './CollectionTechnical/CollectionTechnicalForm';
import BasicStyle from '../BasicStyle.css';

const MetadataCollectionForm = ({
  handlers: { onClose },
  handleSubmit,
  initialValues,
  invalid,
  isLoading,
  onDelete,
  pristine,
  submitting,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initialAccordionStatus = {
    editCollectionInfo: true,
    editCollectionManagement: true,
    editCollectionTechnical: true
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
              id="clickable-closecollectiondialog"
              onClick={onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const getLastMenu = () => {
    const isEditing = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {isEditing && (
          <IfPermission perm="finc-config.metadata-collections.item.delete">
            <Button
              buttonStyle="danger"
              disabled={confirmDelete}
              id="clickable-delete-collection"
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
        data-test-collection-form-cancel-button
        id="clickable-close-collection-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-config.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-collection-form-submit-button
        disabled={disabled}
        id="clickable-savecollection"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finc-config.form.saveAndClose" />
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
      data-test-collection-form-page
      id="form-collection"
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={footer}
          renderHeader={renderFormPaneHeader}
        >
          <div className={BasicStyle.styleForFormContent}>
            <AccordionSet initialStatus={initialAccordionStatus}>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton id="clickable-expand-all" />
                </Col>
              </Row>
              {initialValues.metadata &&
                initialValues.metadata.createdDate && (
                  <ViewMetaData metadata={initialValues.metadata} />
              )}
              <CollectionInfoForm
                accordionId="editCollectionInfo"
                expanded={initialAccordionStatus.editCollectionInfo}
              />
              <CollectionManagementForm
                accordionId="editCollectionManagement"
                expanded={initialAccordionStatus.editCollectionManagement}
              />
              <CollectionTechnicalForm
                accordionId="editCollectionTechnical"
                expanded={initialAccordionStatus.editCollectionTechnical}
              />
            </AccordionSet>
            <ConfirmationModal
              heading={<FormattedMessage id="ui-finc-config.form.delete" />}
              id="delete-collection-confirmation"
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

MetadataCollectionForm.propTypes = {
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

MetadataCollectionForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  // set navigationCheck true for confirming changes
  navigationCheck: true,
})(MetadataCollectionForm);

import PropTypes from 'prop-types';
import { useState } from 'react';
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
import { IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

import BasicStyle from '../BasicStyle.css';

const FormContainer = ({
  accordionComponents,
  deletePermission,
  formId,
  handlers: { onClose },
  handleSubmit,
  initialValues = {},
  invalid,
  idPrefix,
  isLoading,
  onDelete,
  pristine,
  submitting,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accordionsState, setAccordionsState] = useState(
    Object.fromEntries(accordionComponents.map(({ id }) => [id, true]))
  );

  const handleExpandAll = (obj) => setAccordionsState(obj);
  const handleAccordionToggle = ({ id }) => setAccordionsState({ ...accordionsState, [id]: !accordionsState[id] });

  const doBeginDelete = () => setConfirmDelete(true);

  const doConfirmDelete = (confirmation) => {
    if (!confirmation) setConfirmDelete(false);
  };

  const getFirstMenu = () => (
    <PaneMenu>
      <FormattedMessage id="ui-finc-config.form.close">
        {([ariaLabel]) => (
          <IconButton
            aria-label={ariaLabel}
            icon="times"
            id={`clickable-close-${idPrefix}-dialog`}
            onClick={onClose}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  const getLastMenu = () => (
    <PaneMenu>
      {initialValues?.id && (
        <IfPermission perm={deletePermission}>
          <Button
            buttonStyle="danger"
            disabled={confirmDelete}
            id={`clickable-delete-${idPrefix}`}
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

  const getPaneFooter = () => {
    const disabled = pristine || submitting || invalid;
    return (
      <PaneFooter
        renderEnd={
          <Button
            buttonStyle="primary mega"
            disabled={disabled}
            id={`clickable-save-${idPrefix}`}
            marginBottom0
            onClick={handleSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        }
        renderStart={
          <Button
            buttonStyle="default mega"
            id={`clickable-close-${idPrefix}-form`}
            marginBottom0
            onClick={onClose}
          >
            <FormattedMessage id="ui-finc-config.form.cancel" />
          </Button>
        }
      />
    );
  };

  if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

  const name = initialValues.label;

  return (
    <form
      className={BasicStyle.styleForFormRoot}
      id={formId}
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={getPaneFooter()}
          renderHeader={() => (
            <PaneHeader
              firstMenu={getFirstMenu()}
              lastMenu={getLastMenu()}
              paneTitle={
                initialValues.id
                  ? initialValues.label
                  : <FormattedMessage id="ui-finc-config.form.create" />
              }
            />
          )}
        >
          <div className={BasicStyle.styleForFormContent}>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={accordionsState}
                    onToggle={handleExpandAll}
                  />
                </Col>
              </Row>

              {initialValues.metadata?.createdDate && (
                <ViewMetaData metadata={initialValues.metadata} />
              )}

              {accordionComponents.map(({ Component, id }) => (
                <Component
                  key={id}
                  accordionId={id}
                  expanded={accordionsState[id]}
                  onToggle={() => handleAccordionToggle({ id })}
                />
              ))}
            </AccordionSet>

            <ConfirmationModal
              heading={<FormattedMessage id="ui-finc-config.form.delete" />}
              id={`delete-${idPrefix}-confirmation`}
              message={
                <FormattedMessage
                  id="ui-finc-config.form.delete.confirm.message"
                  values={{ name }}
                />
              }
              onCancel={() => doConfirmDelete(false)}
              onConfirm={onDelete}
              open={confirmDelete}
            />
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

FormContainer.propTypes = {
  accordionComponents: PropTypes.arrayOf(PropTypes.shape({
    Component: PropTypes.elementType.isRequired,
    id: PropTypes.string.isRequired,
  })),
  deletePermission: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  handlers: PropTypes.shape({ onClose: PropTypes.func.isRequired }),
  handleSubmit: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default FormContainer;

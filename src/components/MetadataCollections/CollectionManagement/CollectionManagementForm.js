import _ from 'lodash';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl
} from 'react-intl';

import {
  Accordion,
  ConfirmationModal,
  Col,
  Label,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import { Required } from '../../DisplayUtils/Validate';
import PermittedForField from '../../DisplayUtils/PermittedForField';
import {
  metadataAvailableOptions,
  usageRestrictedOptions,
  freeContentOptions,
  lodPublicationOptions
} from '../../DataOptions/dataOptions';
import BasicCss from '../../BasicStyle.css';

let permittedIsRequired;

const CollectionManagementForm = ({
  accordionId,
  expanded,
  onToggle,
  values,
}) => {
  const { change } = useForm();

  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedUsageRestricted, setSelectedUsageRestricted] = useState('');
  const [addPermittedForField, setAddPermittedForField] = useState(false);

  const [update, setUpdate] = useState(0); // eslint-disable-line no-unused-vars

  const containerRect = useRef();

  const changeSelectedUsageRestricted = event => {
    event.preventDefault();

    const usageRestrictedVal = event.target.value;
    const permittedValue = _.get(values, 'permittedFor', []);

    if (usageRestrictedVal === 'yes') {
      setAddPermittedForField(true);
    } else if (permittedValue.length > 0) {
      setAddPermittedForField(false);
      setConfirmClear(true);
      setSelectedUsageRestricted(usageRestrictedVal);
    }

    change('usageRestricted', usageRestrictedVal);
  };

  // this is the equivalent of `forceUpdate` for functional components.
  const updateHandle = () => {
    if (containerRect.current) {
      setUpdate(u => u + 1);
    }
  };

  const confirmClearPermittedFor = confirmation => {
    if (confirmation) {
      change('permittedFor', []);
      change('usageRestricted', selectedUsageRestricted);
      updateHandle();
    } else {
      change('usageRestricted', 'yes');
      updateHandle();
    }
    setConfirmClear(false);
  };

  const getDataOptions = (intl, field) => {
    return field.map((item) => ({
      label: item.value ? intl.formatMessage({ id: `ui-finc-config.dataOption.${item.value}` }) : '',
      value: item.value,
    }));
  };

  const confirmationMessage = (
    <FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.confirmClearMessage" />
  );

  const usageRestricted = _.get(values, 'usageRestricted', '');

  if (usageRestricted === 'yes') {
    permittedIsRequired = true;
  } else {
    permittedIsRequired = false;
  }

  const permittedForLabel = (permittedIsRequired ? <Label className={BasicCss.styleForFormLabel} required><FormattedMessage id="ui-finc-config.collection.permittedFor" /></Label> : <Label className={BasicCss.styleForFormLabel}><FormattedMessage id="ui-finc-config.collection.permittedFor" /></Label>);

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-config.collection.managementAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={8}>
          <IntlConsumer>
            {intl => (
              <Field
                component={Select}
                dataOptions={getDataOptions(intl, metadataAvailableOptions)}
                fullWidth
                id="addcollection_metadataAvailable"
                label={<FormattedMessage id="ui-finc-config.collection.metadataAvailable" />}
                name="metadataAvailable"
                placeholder=""
              />
            )}
          </IntlConsumer>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <IntlConsumer>
            {intl => (
              <Field
                component={Select}
                dataOptions={getDataOptions(intl, usageRestrictedOptions)}
                fullWidth
                id="addcollection_usageRestricted"
                label={<FormattedMessage id="ui-finc-config.collection.usageRestricted" />}
                name="usageRestricted"
                onChange={changeSelectedUsageRestricted}
                placeholder=" "
                required
                validate={Required}
              />
            )}
          </IntlConsumer>
        </Col>
      </Row>
      {/* PERMITTED FOR is repeatable */}
      <div className={BasicCss.addMarginBottomAndTop}>
        <Row>
          {permittedForLabel}
        </Row>
        <Row>
          <Col xs={12}>
            <FieldArray
              addPermittedForField={addPermittedForField}
              component={PermittedForField}
              disable={!permittedIsRequired}
              id="display_permittedFor"
              name="permittedFor"
            />
          </Col>
        </Row>
      </div>
      <Row>
        <Col xs={8}>
          <IntlConsumer>
            {intl => (
              <Field
                component={Select}
                dataOptions={getDataOptions(intl, freeContentOptions)}
                fullWidth
                id="addcollection_freeContent"
                label={<FormattedMessage id="ui-finc-config.collection.freeContent" />}
                name="freeContent"
                placeholder=""
              />
            )}
          </IntlConsumer>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <IntlConsumer>
            {intl => (
              <Field
                component={Select}
                dataOptions={getDataOptions(intl, lodPublicationOptions)}
                fullWidth
                id="addcollection_lodpublication"
                label={<FormattedMessage id="ui-finc-config.collection.lod.publication" />}
                name="lod.publication"
                placeholder=""
              />
            )}
          </IntlConsumer>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addcollection_lodnote"
            label={<FormattedMessage id="ui-finc-config.collection.lod.note" />}
            name="lod.note"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addcollection_generalNotes"
            label={<FormattedMessage id="ui-finc-config.collection.generalNotes" />}
            name="generalNotes"
          />
        </Col>
      </Row>
      <ConfirmationModal
        confirmLabel={<FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.confirmClearLabel" />}
        heading={<FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.clearModalHeading" />}
        id="clear-permitted-for-confirmation"
        message={confirmationMessage}
        onCancel={() => { confirmClearPermittedFor(false); }}
        onConfirm={() => { confirmClearPermittedFor(true); }}
        open={confirmClear}
      />
    </Accordion>
  );
};

CollectionManagementForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default injectIntl(CollectionManagementForm);

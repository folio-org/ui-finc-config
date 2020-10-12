import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
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

class CollectionManagementForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmClear: false,
      selectedUsageRestricted: '',
      addPermittedForField: false,
    };
  }

  changeSelectedUsageRestricted = event => {
    event.preventDefault();

    const val = event.target.value;

    if (val === 'yes') {
      this.setState({ addPermittedForField: true });
    } else {
      this.setState({ addPermittedForField: false, confirmClear: true, selectedUsageRestricted: val });
    }

    this.props.form.mutators.setUsageRestricted({}, val);
  };

  confirmClearPermittedFor = confirmation => {
    if (confirmation) {
      this.props.form.mutators.clearPermittedFor({}, this.props.values);
      this.props.form.mutators.setUsageRestricted({}, this.state.selectedUsageRestricted);
      setTimeout(() => {
        this.forceUpdate();
      });
    } else {
      this.props.form.mutators.setUsageRestricted({}, 'yes');
      setTimeout(() => {
        this.forceUpdate();
      });
    }
    this.setState({ confirmClear: false });
  };

  getDataOptions(intl, field) {
    return field.map((item) => ({
      label: intl.formatMessage({ id: `ui-finc-config.dataOption.${item.value}` }),
      value: item.value,
    }));
  }

  render() {
    const { confirmClear } = this.state;
    const { expanded, onToggle, accordionId } = this.props;
    const confirmationMessage = (
      <FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.confirmClearMessage" />
    );

    const usageRestricted = _.get(this.props.values, 'usageRestricted', '');

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
                  dataOptions={this.getDataOptions(intl, metadataAvailableOptions)}
                  fullWidth
                  id="addcollection_metadataAvailable"
                  label={<FormattedMessage id="ui-finc-config.collection.metadataAvailable" />}
                  name="metadataAvailable"
                  placeholder="Select if metadata is available for the metadata collection"
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
                  dataOptions={this.getDataOptions(intl, usageRestrictedOptions)}
                  fullWidth
                  id="addcollection_usageRestricted"
                  label={<FormattedMessage id="ui-finc-config.collection.usageRestricted" />}
                  name="usageRestricted"
                  onChange={this.changeSelectedUsageRestricted}
                  placeholder="Select if usage is restricted for the metadata collection"
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
                addPermittedForField={this.state.addPermittedForField}
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
                  dataOptions={this.getDataOptions(intl, freeContentOptions)}
                  fullWidth
                  id="addcollection_freeContent"
                  label={<FormattedMessage id="ui-finc-config.collection.freeContent" />}
                  name="freeContent"
                  placeholder="Select if content is free for the metadata collection"
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
                  dataOptions={this.getDataOptions(intl, lodPublicationOptions)}
                  fullWidth
                  id="addcollection_lodpublication"
                  label={<FormattedMessage id="ui-finc-config.collection.lod.publication" />}
                  name="lod.publication"
                  placeholder="Select the LOD publication for the metadata collection"
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
          onCancel={() => { this.confirmClearPermittedFor(false); }}
          onConfirm={() => { this.confirmClearPermittedFor(true); }}
          open={confirmClear}
        />
      </Accordion>
    );
  }
}

CollectionManagementForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      clearPermittedFor: PropTypes.func,
      setUsageRestricted: PropTypes.func
    })
  }),
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
};

export default injectIntl(CollectionManagementForm);

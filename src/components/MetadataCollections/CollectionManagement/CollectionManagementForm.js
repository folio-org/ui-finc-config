import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  ConfirmationModal,
  Label,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';
import PermittedForField from '../../DisplayUtils/PermittedForField';

import BasicCss from '../../BasicStyle.css';

let permittedIsRequired;

class CollectionManagementForm extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
  };

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

  render() {
    const { confirmClear } = this.state;
    const { expanded, onToggle, accordionId } = this.props;
    const confirmationMessage = (
      <FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.confirmClearMessage" />
    );
    const dataOptionsMetadataAvailable = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'undetermined', label: 'Undetermined' }
    ];
    const dataOptionsUsageRestricted = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ];
    const dataOptionsFreeContent = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'undetermined', label: 'Undetermined' }
    ];
    const dataOptionsLodPublication = [
      { value: 'permitted (interpreted)', label: 'Permitted (interpreted)' },
      { value: 'permitted (explicit)', label: 'Permitted (explicit)' },
      { value: 'permitted (explicit) under conditions', label: 'Permitted (explicit) under conditions' },
      { value: 'prohibited (interpreted)', label: 'Prohibited (interpreted)' },
      { value: 'prohibited (explicit)', label: 'Prohibited (explicit)' },
      { value: 'silent', label: 'Silent' }
    ];

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
            <Field
              component={Select}
              dataOptions={dataOptionsMetadataAvailable}
              fullWidth
              id="addcollection_metadataAvailable"
              label={<FormattedMessage id="ui-finc-config.collection.metadataAvailable" />}
              name="metadataAvailable"
              placeholder="Select if metadata is available for the metadata collection"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={dataOptionsUsageRestricted}
              fullWidth
              id="addcollection_usageRestricted"
              label={<FormattedMessage id="ui-finc-config.collection.usageRestricted" />}
              name="usageRestricted"
              onChange={this.changeSelectedUsageRestricted}
              placeholder="Select if usage is restricted for the metadata collection"
              required
              validate={Required}
            />
          </Col>
        </Row>
        {/* PERMITTED FOR is repeatable */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            {permittedForLabel}
          </Row>
          <Row>
            <Col xs={12}>
              <FormattedMessage id="ui-finc-config.collection.permittedFor">
                {ariaLabel => (
                  <FieldArray
                    ariaLabel={ariaLabel}
                    component={PermittedForField}
                    id="display_permittedFor"
                    // add name to the array-field, which should be changed
                    name="permittedFor"
                    disable={!permittedIsRequired}
                    {...this.props}
                    addPermittedForField={this.state.addPermittedForField}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={dataOptionsFreeContent}
              fullWidth
              id="addcollection_freeContent"
              label={<FormattedMessage id="ui-finc-config.collection.freeContent" />}
              name="freeContent"
              placeholder="Select if content is free for the metadata collection"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={dataOptionsLodPublication}
              fullWidth
              id="addcollection_lodpublication"
              label={<FormattedMessage id="ui-finc-config.collection.lod.publication" />}
              name="lod.publication"
              placeholder="Select the LOD publication for the metadata collection"
            />
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
              placeholder="Enter a LOD note for the metadata collection"
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
              placeholder="Enter a general note for the metadata collection"
            />
          </Col>
        </Row>
        <ConfirmationModal
          id="clear-permitted-for-confirmation"
          open={confirmClear}
          heading={<FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.clearModalHeading" />}
          message={confirmationMessage}
          onConfirm={() => {
            this.confirmClearPermittedFor(true);
          }}
          onCancel={() => {
            this.confirmClearPermittedFor(false);
          }}
          confirmLabel={<FormattedMessage id="ui-finc-config.collection.form.selectedUsageRestricted.confirmClearLabel" />}
        />
      </Accordion>
    );
  }
}

CollectionManagementForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  values: PropTypes.shape(),
  metadataCollection: PropTypes.object,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      clearPermittedFor: PropTypes.func,
      setUsageRestricted: PropTypes.func
    })
  }),
};

export default CollectionManagementForm;

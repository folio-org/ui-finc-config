import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';

import DisplayContact from '../../DisplayUtils/DisplayContact';
import FindOrganization from './FindOrganization/FindOrganization';

import BasicCss from '../../BasicStyle.css';

class SourceManagementForm extends React.Component {
  constructor(props) {
    super(props);

    const intialVendor = props.initialValues.organization || {};

    this.state = {
      organization: intialVendor,
    };
  }

  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-finc-config.source.managementAccordion" />}
        onToggle={onToggle}
        open={expanded}
      >
        <div className={BasicCss.addMarginBottom}>
          {/* Plugin has to be inside of Field, otherwise pristine is not working */}
          <Field
            component={FindOrganization}
            name="organization"
            intialVendor={this.state.organization}
            stripes={this.props.stripes}
            {...this.props}
          />
        </div>
        {/* CONTACTS INTERNAL is repeatable */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            <Label className={BasicCss.styleForFormLabel}>
              <FormattedMessage id="ui-finc-config.source.contact.title" />
            </Label>
          </Row>
          <Row>
            <Col xs={4}>
              <Label className={BasicCss.styleForFormLabel}>
                <FormattedMessage id="ui-finc-config.source.contact.name" />
              </Label>
            </Col>
            <Col xs={4}>
              <Label className={BasicCss.styleForFormLabel}>
                <FormattedMessage id="ui-finc-config.source.contact.role" />
              </Label>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormattedMessage id="ui-finc-config.source.contacts.title">
                {ariaLabel => (
                  <FieldArray
                    ariaLabel={ariaLabel}
                    component={DisplayContact}
                    id="display_contact"
                    // add name to the array-field, which should be changed
                    name="contacts"
                    {...this.props}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_indexingLevel"
              label={<FormattedMessage id="ui-finc-config.source.indexingLevel" />}
              name="indexingLevel"
              placeholder="Enter a indexing level for the metadata source"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_generalNotes"
              label={<FormattedMessage id="ui-finc-config.source.generalNotes" />}
              name="generalNotes"
              placeholder="Enter a general note for the metadata source"
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

SourceManagementForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  change: PropTypes.func,
  expanded: PropTypes.bool,
  initialValues: PropTypes.shape({
    organization: PropTypes.object
  }),
  onToggle: PropTypes.func,
  stripes: PropTypes.object,
};

export default SourceManagementForm;

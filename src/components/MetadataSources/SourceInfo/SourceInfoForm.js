import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';
import implementationStatusOptions from '../../DataOptions/implementationStatus';

class SourceInfoForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        label={<FormattedMessage id="ui-finc-config.source.generalAccordion" />}
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
      >
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_label"
              label={<FormattedMessage id="ui-finc-config.source.label" />}
              name="label"
              placeholder="Enter a name to identify the metadata source"
              required
              validate={Required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_description"
              label={<FormattedMessage id="ui-finc-config.source.description" />}
              name="description"
              placeholder="Enter a description for the metadata source"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={implementationStatusOptions}
              fullWidth
              id="addsource_status"
              label={<FormattedMessage id="ui-finc-config.source.status" />}
              name="status"
              placeholder="Select a status for the metadata source"
              required
              validate={Required}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

SourceInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default SourceInfoForm;

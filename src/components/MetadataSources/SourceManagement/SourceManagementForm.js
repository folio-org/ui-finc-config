import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import ContactFieldArray from '../../DisplayUtils/ContactFieldArray';

class SourceManagementForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-finc-config.source.managementAccordion" />}
        onToggle={onToggle}
        open={expanded}
      >
        <FieldArray
          component={ContactFieldArray}
          // add name to the array-field, which should be changed
          name="contacts"
          intialContacts={_.get(this.props.initialValues, 'contacts', [])}
        />
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
  expanded: PropTypes.bool,
  initialValues: PropTypes.object,
  onToggle: PropTypes.func,
};

export default SourceManagementForm;

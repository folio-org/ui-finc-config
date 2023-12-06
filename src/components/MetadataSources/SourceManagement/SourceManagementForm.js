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

import ContactFieldArray from './Contact/ContactFieldArray';
import FindOrganization from './FindOrganization/FindOrganization';
import BasicCss from '../../BasicStyle.css';

const SourceManagementForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-config.source.managementAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <div className={BasicCss.addMarginBottom}>
        <FindOrganization />
      </div>
      <FieldArray
        component={ContactFieldArray}
        name="contacts"
      />
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addsource_indexingLevel"
            label={<FormattedMessage id="ui-finc-config.source.indexingLevel" />}
            name="indexingLevel"
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
          />
        </Col>
      </Row>
    </Accordion>
  );
};

SourceManagementForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default SourceManagementForm;

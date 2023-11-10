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
import { IntlConsumer } from '@folio/stripes/core';

import { Required } from '../../DisplayUtils/Validate';
import { implementationStatusOptions } from '../../DataOptions/dataOptions';

export const getDataOptions = (intl, field) => {
  return field.map((item) => ({
    label: item.value ? intl.formatMessage({ id: `ui-finc-config.dataOption.${item.value}` }) : '',
    value: item.value,
  }));
};

const SourceInfoForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      label={<FormattedMessage id="ui-finc-config.source.generalAccordion" />}
      onToggle={onToggle}
      open={expanded}
      id={accordionId}
    >
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addsource_label"
            label={<FormattedMessage id="ui-finc-config.source.label" />}
            name="label"
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
          />
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <IntlConsumer>
            {intl => (
              <Field
                component={Select}
                dataOptions={getDataOptions(intl, implementationStatusOptions)}
                fullWidth
                id="addsource_status"
                label={<FormattedMessage id="ui-finc-config.source.status" />}
                name="status"
                placeholder=" "
                required
                validate={Required}
              />
            )}
          </IntlConsumer>
        </Col>
      </Row>
    </Accordion>
  );
};

SourceInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onToggle: PropTypes.func,
};

export default SourceInfoForm;

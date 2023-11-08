import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';

import {
  Button,
  Col,
  IconButton,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from './Validate';
import usePrevious from '../hooks/usePrevious';

const PermittedForField = ({
  addPermittedForField,
  ariaLabel,
  disable,
  fields,
  intl,
}) => {
  const prevAddPermittedForField = usePrevious(addPermittedForField) || [];

  useEffect(() => {
    // add first required permitted-for-field, if usageRestricted changed to 'yes'
    if (prevAddPermittedForField !== addPermittedForField) {
      if (addPermittedForField) {
        fields.push('');
      }
    }
  });

  return (
    <Row>
      <Col xs={12}>
        {fields.map((elem, index) => (
          <Row key={index}>
            <Col xs={8}>
              <Field
                ariaLabel={`${ariaLabel} #${parseInt(index + 1, 10)}`}
                component={TextField}
                fullWidth
                id={elem}
                name={elem}
                placeholder={intl.formatMessage({ id: 'ui-finc-config.collection.placeholder.permittedFor' })}
                // first field is required
                validate={index === 0 ? Required : undefined}
              />
            </Col>
            <Col xs={1}>
              {/* no trash icon for first required field */}
              {index !== 0 ?
                <IconButton
                  icon="trash"
                  onClick={index !== 0 ? () => fields.remove(index) : undefined}
                /> : ''}
            </Col>
          </Row>
        ))}
      </Col>
      <Col xs={4}>
        <Button onClick={() => fields.push('')} disabled={disable}><FormattedMessage id="ui-finc-config.form.button.add" /></Button>
      </Col>
    </Row>
  );
};

PermittedForField.propTypes = {
  addPermittedForField: PropTypes.bool,
  ariaLabel: PropTypes.string,
  disable: PropTypes.bool,
  fields: PropTypes.object,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
};

export default injectIntl(PermittedForField);

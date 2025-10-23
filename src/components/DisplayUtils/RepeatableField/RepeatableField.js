import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  IconButton,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../Validate';

const RepeatableField = ({
  ariaLabel,
  isFirstFieldRequired = false,
  fields,
  placeholder = '',
  fieldValidate = () => {},
}) => {
  const getValidate = (index) => (value) => {
    if (isFirstFieldRequired && index === 0) {
      const requiredError = Required(value);
      if (requiredError) return requiredError;
    }

    return fieldValidate(value);
  };

  return (
    <Row>
      <Col xs={12}>
        {fields.map((elem, index) => (
          <Row key={elem}>
            <Col xs={8}>
              <Field
                ariaLabel={`${ariaLabel} #${Number.parseInt(index + 1, 10)}`}
                component={TextField}
                fullWidth
                id={elem}
                name={elem}
                placeholder={placeholder}
                required={isFirstFieldRequired && index === 0}
                validate={getValidate(index)}
              />
            </Col>
            <Col xs={1}>
              {/* no trash icon if first field is required */}
              {(!isFirstFieldRequired || index !== 0) &&
              <IconButton
                icon="trash"
                onClick={() => fields.remove(index)}
              />}
            </Col>
          </Row>
        ))}
      </Col>
      <Col xs={4}>
        <Button onClick={() => fields.push('')}><FormattedMessage id="ui-finc-config.form.button.add" /></Button>
      </Col>
    </Row>
  );
};

RepeatableField.propTypes = {
  ariaLabel: PropTypes.string,
  fields: PropTypes.object,
  fieldValidate: PropTypes.func,
  isFirstFieldRequired: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default RepeatableField;

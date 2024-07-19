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

import { ValidateUrl } from './Validate';

const RepeatableFieldValidUrl = ({
  ariaLabel,
  fields,
  placeholder
}) => {
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
                placeholder={placeholder}
                validate={ValidateUrl}
              />
            </Col>
            <Col xs={1}>
              <IconButton
                icon="trash"
                onClick={() => fields.remove(index)}
              />
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

RepeatableFieldValidUrl.propTypes = {
  ariaLabel: PropTypes.string,
  fields: PropTypes.object,
  placeholder: PropTypes.string,
};

export default RepeatableFieldValidUrl;

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

import { Required } from './Validate';

const RequiredRepeatableField = ({
  ariaLabel,
  fields,
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
        <Button onClick={() => fields.push('')}><FormattedMessage id="ui-finc-config.form.button.add" /></Button>
      </Col>
    </Row>
  );
};

RequiredRepeatableField.propTypes = {
  ariaLabel: PropTypes.string,
  fields: PropTypes.object,
};

export default RequiredRepeatableField;

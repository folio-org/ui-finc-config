import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  IconButton,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from './Validate';

class RequiredRepeatableField extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
  };

  render() {
    const { fields } = this.props;

    return (
      <Row>
        <Col xs={12}>
          {fields.map((elem, index) => (
            <Row key={index}>
              <Col xs={8}>
                <Field
                  ariaLabel={elem}
                  name={elem}
                  id={elem}
                  component={TextField}
                  fullWidth
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
          <Button onClick={() => fields.push('')}>+ Add</Button>
        </Col>
      </Row>
    );
  }
}

export default RequiredRepeatableField;

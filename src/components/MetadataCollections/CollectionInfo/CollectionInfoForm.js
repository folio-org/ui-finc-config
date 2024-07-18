import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';
import FindSource from './FindSource/FindSource';

const CollectionInfoForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-config.collection.generalAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addcollection_label"
            label={<FormattedMessage id="ui-finc-config.collection.label" />}
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
            id="addcollection_description"
            label={<FormattedMessage id="ui-finc-config.collection.description" />}
            name="description"
          />
        </Col>
      </Row>
      <div>
        <FindSource />
      </div>
    </Accordion>
  );
};

CollectionInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default CollectionInfoForm;

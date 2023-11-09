import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Field } from 'react-final-form';
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
  initialValues,
  onToggle,
}) => {
  const [query, setQuery] = useState(initialValues.mdSource || {});

  const { change } = useForm();

  const updateValue = useCallback((newSource) => {
    const sourceUpdated = {
      id: newSource.id,
      name: newSource.label,
    };

    // change state
    setQuery(sourceUpdated);

    // change field
    change('mdSource', sourceUpdated);
  }, [change]);

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
        {/* Plugin has to be inside of Field, otherwise pristine is not working */}
        <Field
          component={FindSource}
          name="mdSource"
          id="addcollection_mdSource"
          intialSource={query}
          selectSource={selectedSource => updateValue(selectedSource)}
        />
      </div>
    </Accordion>
  );
};

CollectionInfoForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  initialValues: PropTypes.shape({
    mdSource: PropTypes.object
  }),
  onToggle: PropTypes.func,
};

export default CollectionInfoForm;

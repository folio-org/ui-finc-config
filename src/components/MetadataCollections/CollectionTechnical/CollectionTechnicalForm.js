import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { RepeatableTextField } from '@folio/stripes-leipzig-components';
import {
  Accordion,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';
import {
  Required,
  ValidateUrl,
} from '../../DisplayUtils/Validate';

const CollectionTechnicalForm = ({
  accordionId,
  expanded,
  intl,
  onToggle,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-finc-config.collection.technicalAccordion" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            fullWidth
            id="addcollection_collectionId"
            label={<FormattedMessage id="ui-finc-config.collection.id" />}
            name="collectionId"
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
            id="addcollection_productIsil"
            label={<FormattedMessage id="ui-finc-config.collection.productIsil" />}
            name="productIsil"
          />
        </Col>
      </Row>
      {/* TICKETS (is repeatable) ... */}
      <div className={BasicCss.addMarginBottomAndTop}>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.collection.tickets" />
          </Label>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldArray
              component={RepeatableTextField}
              fieldValidate={ValidateUrl}
              name="tickets"
              placeholder={intl.formatMessage({ id: 'ui-finc-config.collection.placeholder.tickets' })}
            />
          </Col>
        </Row>
      </div>
      {/* CONTENT FILES (is repeatable) ... */}
      <div className={BasicCss.addMarginBottomAndTop}>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.collection.contentFiles" />
          </Label>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldArray
              component={RepeatableTextField}
              fieldValidate={ValidateUrl}
              name="contentFiles"
              placeholder={intl.formatMessage({ id: 'ui-finc-config.collection.placeholder.contentFiles' })}
            />
          </Col>
        </Row>
      </div>
      {/* SOLR MEGA COLLECTION (is repeatable and required) ... */}
      <div className={BasicCss.addMarginBottomAndTop}>
        <Row>
          <Label className={BasicCss.styleForFormLabel} required>
            <FormattedMessage id="ui-finc-config.collection.solrMegaCollections" />
          </Label>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldArray
              component={RepeatableTextField}
              isFirstFieldRequired
              name="solrMegaCollections"
            />
          </Col>
        </Row>
      </div>
    </Accordion>
  );
};

CollectionTechnicalForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onToggle: PropTypes.func,
};

export default injectIntl(CollectionTechnicalForm);

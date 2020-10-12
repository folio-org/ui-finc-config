import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Label,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import {
  IntRequired,
  ValidateUrl
} from '../../DisplayUtils/Validate';
import RepeatableField from '../../DisplayUtils/RepeatableField';
import RepeatableFieldValidUrl from '../../DisplayUtils/RepeatableFieldValidUrl';
import { solrShardOptions } from '../../DataOptions/dataOptions';
import BasicCss from '../../BasicStyle.css';

class SourceTechnicalForm extends React.Component {
  getDataOptions(field) {
    return field.map((item) => ({
      label: item.value,
      value: item.value,
    }));
  }

  render() {
    const { accordionId, expanded, onToggle } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-finc-config.source.technicalAccordion" />}
        onToggle={onToggle}
        open={expanded}
      >
        {/* TICKETS (is repeatable) ... */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            <Label className={BasicCss.styleForFormLabel}>
              <FormattedMessage id="ui-finc-config.source.tickets" />
            </Label>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldArray
                component={RepeatableFieldValidUrl}
                id="display_tickets"
                name="tickets"
              />
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_accessUrl"
              label={<FormattedMessage id="ui-finc-config.source.accessUrl" />}
              name="accessUrl"
              validate={ValidateUrl}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_sourceId"
              label={<FormattedMessage id="ui-finc-config.source.id" />}
              name="sourceId"
              required
              validate={IntRequired}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={Select}
              dataOptions={this.getDataOptions(solrShardOptions)}
              fullWidth
              id="addsource_solrShard"
              label={<FormattedMessage id="ui-finc-config.source.solrShard" />}
              name="solrShard"
              placeholder="Select a solr shard for the metadata source"
            />
          </Col>
        </Row>
        {/* TODO: deliveryMethods (is repeatable; is value list ???) ... */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            <Label className={BasicCss.styleForFormLabel}>
              <FormattedMessage id="ui-finc-config.source.deliveryMethods" />
            </Label>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldArray
                component={RepeatableField}
                id="display_delivery_methods"
                name="deliveryMethods"
              />
            </Col>
          </Row>
        </div>
        {/* formats (is repeatable) ... */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            <Label className={BasicCss.styleForFormLabel}>
              <FormattedMessage id="ui-finc-config.source.formats" />
            </Label>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldArray
                component={RepeatableField}
                id="display_formats"
                name="formats"
              />
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addsource_updateRhythm"
              label={<FormattedMessage id="ui-finc-config.source.updateRhythm" />}
              name="updateRhythm"
            />
          </Col>
        </Row>
        {/* inferiorTo (is repeatable) ... */}
        <div className={BasicCss.addMarginBottomAndTop}>
          <Row>
            <Label className={BasicCss.styleForFormLabel}>
              <FormattedMessage id="ui-finc-config.source.inferiorTo" />
            </Label>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldArray
                component={RepeatableField}
                id="display_inferior_to"
                name="inferiorTo"
              />
            </Col>
          </Row>
        </div>
      </Accordion>
    );
  }
}

SourceTechnicalForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default SourceTechnicalForm;

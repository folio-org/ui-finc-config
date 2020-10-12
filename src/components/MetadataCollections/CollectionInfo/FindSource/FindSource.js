import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage
} from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';
import { MdSourceRequired } from '../../../DisplayUtils/Validate';

class FindSource extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    const s = props.intialSource || {};

    this.inputSourceId = s.id;
    this.inputSourceName = s.name;
  }

  selectSource = (s) => {
    this.props.form.mutators.setSource({
      id: s.id,
      name: s.label,
    });

    this.setState(() => {
      return { source: {
        id: s.id,
        name: s.label
      } };
    });
  }

  render() {
    const { intl } = this.props;
    const disableRecordCreation = true;
    const buttonProps = { 'marginBottom0': true };
    const pluggable =
      <Pluggable
        aria-haspopup="true"
        buttonProps={buttonProps}
        columnMapping={this.columnMapping}
        dataKey="source"
        disableRecordCreation={disableRecordCreation}
        id="clickable-find-source"
        marginTop0
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'name',
          });
        }}
        searchButtonStyle="default"
        searchLabel={<FormattedMessage id="ui-finc-config.plugin.buttonLabel.source" />}
        selectSource={this.selectSource}
        type="find-finc-metadata-source"
        visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
        {...this.props}
      >
        <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Label className={BasicCss.styleForFormLabel} required>
            <FormattedMessage id="ui-finc-config.collection.mdSource" />
          </Label>
        </Row>
        <Row>
          <Col xs={4}>
            { pluggable }
          </Col>
          <Col xs={4}>
            <Field
              component={TextField}
              fullWidth
              id="addcollection_mdSource"
              name="mdSource.name"
              placeholder={intl.formatMessage({ id: 'ui-finc-config.collection.placeholder.mdSource' })}
              readOnly
              validate={MdSourceRequired}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

FindSource.propTypes = {
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setSource: PropTypes.func,
    }),
  }),
  intialSource: PropTypes.object,
};

export default injectIntl(FindSource);

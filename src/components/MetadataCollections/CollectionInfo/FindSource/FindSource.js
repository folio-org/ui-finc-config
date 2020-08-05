import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
        searchLabel="Metadata source"
        selectSource={this.selectSource}
        type="find-finc-metadata-source"
        visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
        {...this.props}
      >
        <div style={{ background: 'red' }}>Plugin not found</div>
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
              ariaLabel="Add metadata source"
              component={TextField}
              fullWidth
              id="addcollection_mdSource"
              name="mdSource.name"
              placeholder="Please add a metadata source"
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
  intialSourceId: PropTypes.string,
  intialSource: PropTypes.object,
  stripes: PropTypes.object,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setSource: PropTypes.func,
    }),
  }),
};

export default FindSource;

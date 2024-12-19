import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';
import { MdSourceRequired } from '../../../DisplayUtils/Validate';

const FindSource = ({
  intl,
}) => {
  const { change } = useForm();

  const selectSource = useCallback((newSource) => {
    const sourceUpdated = {
      id: newSource.id,
      name: newSource.label,
    };

    // change field
    change('mdSource', sourceUpdated);
  }, [change]);

  const columnMapping = {
    name: 'Label',
    id: 'SourceId',
  };
  const disableRecordCreation = true;
  const buttonProps = { marginBottom0: true };
  const pluggable =
    <Pluggable
      aria-haspopup="true"
      buttonProps={buttonProps}
      columnMapping={columnMapping}
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
      selectSource={selectSource}
      type="find-finc-metadata-source"
      visibleColumns={['label', 'sourceId', 'status', 'solrShard', 'lastProcessed']}
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
    </Pluggable>;

  return (
    <>
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
            disabled
            fullWidth
            id="addcollection_mdSource"
            name="mdSource.name"
            placeholder={intl.formatMessage({ id: 'ui-finc-config.collection.placeholder.mdSource' })}
            type="text"
            validate={MdSourceRequired}
          />
        </Col>
      </Row>
    </>
  );
};

FindSource.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
};

export default injectIntl(FindSource);

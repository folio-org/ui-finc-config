import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape
} from 'react-intl';
import {
  makeQueryFunction,
  SearchAndSort
} from '@folio/stripes/smart-components';
import packageInfo from '../../../package';

import MetadataCollectionView from './MetadataCollectionView';
// import MetadataCollectionForm from './MetadataCollectionForm';
import Tabs from '../Tabs/Tabs';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  {
    label: 'Metadata Available',
    name: 'metadataAvailable',
    cql: 'metadataAvailable',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' },
      { name: 'Undetermined', cql: 'undetermined' }
    ],
  },
  {
    label: 'Usage Restricted',
    name: 'usageRestricted',
    cql: 'usageRestricted',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  }
];

class MetadataCollections extends React.Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'label',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'metadataCollections',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'metadata-collections',
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*")',
            {
              'Collection Name': 'label'
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    }
  });

  static propTypes = {
    resources: PropTypes.shape({
      metadataCollections: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      metadataCollections: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }),
      query: PropTypes.shape({
        update: PropTypes.func,
      }).isRequired,
    }).isRequired,
    stripes: PropTypes.object,
    intl: intlShape.isRequired,
  };

  closeNewInstance = (e) => {
    if (e) e.preventDefault();
    this.props.mutator.query.update({ layer: null });
  }

  create = (metadataCollection) => {
    const { mutator } = this.props;
    mutator.records.POST(metadataCollection)
      .then(() => {
        this.closeNewInstance();
      });
  }

  render() {
    const packageInfoReWrite = () => {
      const path = '/fincconfig/metadatacollections';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };

    const { stripes, intl } = this.props;

    return (
      <div isRoot>
        <Tabs
          tabID="metadatacollections"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
        />
        <SearchAndSort
          // change packageInfo to prevent ERROR:Cannot read property 'cql' of undefined if switching tab
          // packageInfo={packageInfo}
          packageInfo={packageInfoReWrite()}
          objectName="metadataCollection"
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          viewRecordComponent={MetadataCollectionView}
          // editRecordComponent={MetadataCollectionForm}
          newRecordInitialValues={{}}
          visibleColumns={['label', 'metadataAvailable', 'freeContent']}
          onCreate={this.create}
          viewRecordPerms="metadatacollections.item.get"
          newRecordPerms="metadatacollections.item.post"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
          columnMapping={{
            label: intl.formatMessage({ id: 'ui-finc-config.collection.label' }),
            metadataAvailable: intl.formatMessage({ id: 'ui-finc-config.collection.metadataAvailable' }),
            freeContent: intl.formatMessage({ id: 'ui-finc-config.collection.freeContent' })
          }}
          stripes={stripes}
        />
      </div>
    );
  }
}

export default injectIntl(MetadataCollections);

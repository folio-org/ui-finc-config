import PropTypes from 'prop-types';

import ViewContainer from '../DisplayUtils/ViewContainer';
import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionManagementView from './CollectionManagement/CollectionManagementView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

const MetadataCollectionView = (props) => {
  const accordionConfig = [
    {
      id: 'managementAccordion',
      labelId: 'ui-finc-config.collection.managementAccordion',
      Component: CollectionManagementView,
    },
    {
      id: 'technicalAccordion',
      labelId: 'ui-finc-config.collection.technicalAccordion',
      Component: CollectionTechnicalView,
    },
  ];

  return (
    <ViewContainer
      accordionConfig={accordionConfig}
      idPrefix="collection"
      infoComponent={CollectionInfoView}
      recordPropKey="metadataCollection"
      {...props}
    />
  );
};

MetadataCollectionView.propTypes = {
  record: PropTypes.object,
};

export default MetadataCollectionView;

const urls = {
  sources: () => '/finc-config/metadata-sources',
  sourceView: id => `/finc-config/metadata-sources/${id}`,
  sourceEdit: id => `/finc-config/metadata-sources/${id}/edit`,
  sourceCreate: () => '/finc-config/metadata-sources/create',

  collections: () => '/finc-config/metadata-collections',
  collectionView: id => `/finc-config/metadata-collections/${id}`,
  collectionEdit: id => `/finc-config/metadata-collections/${id}/edit`,
  collectionCreate: () => '/finc-config/metadata-collections/create',

  showAllCollections: (sourceId) => `/finc-config/metadata-collections?filters=mdSource.${sourceId},metadataAvailable.yes,metadataAvailable.no,metadataAvailable.undetermined,usageRestricted.yes,usageRestricted.no,freeContent.yes,freeContent.no,freeContent.undetermined,&query=`,

  organizationView: id => `/organizations/view/${id}`,
  contactView: id => `/organizations/contacts/details/${id}/view`,
  userView: id => `/users/preview/${id}`,
};

export default urls;

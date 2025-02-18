# Change history for ui-finc-config

## [8.0.0] (IN PROGRESS)
* Restructure SASQ and localStorage ([UIFC-400](https://folio-org.atlassian.net/browse/UIFC-400))
* Add tests for SASQ, adapt renderWithIntlConfiguration ([UIFC-401](https://folio-org.atlassian.net/browse/UIFC-401))
* Add rules for eslint ([UIFC-396](https://folio-org.atlassian.net/browse/UIFC-396))
* Adapt tests for index.js and routes ([UIFC-402](https://folio-org.atlassian.net/browse/UIFC-402))
* Migrate react-intl to v7 ([UIFC-410](https://folio-org.atlassian.net/browse/UIFC-410))
* Migrate stripes dependencies to their Sunflower versions ([UIFC-411](https://folio-org.atlassian.net/browse/UIFC-411))

## [7.0.0](https://github.com/folio-org/ui-finc-config/tree/v7.0.0) (2024-11-04)
* React v19: refactor away from default props for functional components([UIFC-355](https://folio-org.atlassian.net/browse/UIFC-355))
* Fix update resources bug for MetadataSources and MetadataCollections([UIFC-375](https://folio-org.atlassian.net/browse/UIFC-375))
* Fix tests and add mocks local ([UIFC-378](https://folio-org.atlassian.net/browse/UIFC-378))
* Fix GitHub Actions workflow not running for tags ([FOLIO-4086](https://folio-org.atlassian.net/browse/FOLIO-4086))
* Remove dependencies of k-int and stripes-erm-components ([UIFC-365](https://folio-org.atlassian.net/browse/UIFC-365))
* Refine EditCard ([UIFC-381](https://folio-org.atlassian.net/browse/UIFC-381))
* Update required interfaces ([UIFC-384](https://folio-org.atlassian.net/browse/UIFC-384))
* Update permissions ([UIFC-394](https://folio-org.atlassian.net/browse/UIFC-394))

## [6.1.0](https://github.com/folio-org/ui-finc-config/tree/v6.1.0) (2024-03-20)
* Remove deprecated pane properties ([UIFC-337](https://issues.folio.org/browse/UIFC-337))
* Use functional components instead of class components ([UIFC-338](https://issues.folio.org/browse/UIFC-338))
* Use translation keys of stripes-components ([UIFC-354](https://folio-org.atlassian.net/browse/UIFC-354))

## [6.0.0](https://github.com/folio-org/ui-finc-config/tree/v6.0.0) (2023-10-18)
* Migrate to react-intl v6 ([UIFC-326](https://issues.folio.org/browse/UIFC-326))
* Upgrade React to v18 ([UIFC-317](https://issues.folio.org/browse/UIFC-317))
* Update permissions ([UIFC-324](https://issues.folio.org/browse/UIFC-324))
* Replace BigTest tests ([UIFC-288](https://issues.folio.org/browse/UIFC-288))
* Avoid private paths in `stripes-core` imports ([UIFC-312](https://issues.folio.org/browse/UIFC-312))

## [5.1.0](https://github.com/folio-org/ui-finc-config/tree/v5.1.0) (2023-03-16)
* Translations update

## [5.0.0](https://github.com/folio-org/ui-finc-config/tree/v5.0.0) (2023-02-23)
* Bump Stripes to v8, drop `react-redux`, `redux`, bump `plugin-find-finc-metadata-source` ([UIFC-290](https://issues.folio.org/browse/UIFC-290))
* No results shown on first open ([UIFC-297](https://issues.folio.org/browse/UIFC-297))
* Upgrade stripes-erm-components to v8 ([UIFC-295](https://issues.folio.org/browse/UIFC-295))

## [4.1.0](https://github.com/folio-org/ui-finc-config/tree/v4.1.0) (2022-10-26)
* Upgrade Users interface to 16.0 (UIFC-278)
* Replace babel-eslint with @babel/eslint-parser (UIFC-269)

## [4.0.0](https://github.com/folio-org/ui-finc-config/tree/v4.0.0) (2021-09-30)
* Increment stripes to v7 (UIFC-254)

## [3.0.1](https://github.com/folio-org/ui-finc-config/tree/v3.0.1) (2021-06-14)
* Replace bigtest by rtl jest (UIFC-238)
* Translation ast (UIFC-244)

## [3.0.0](https://github.com/folio-org/ui-finc-config/tree/v3.0.0) (2021-03-19)
* Increment `@folio/stripes` to `v6.0` (UIFC-229)

## [2.0.0](https://github.com/folio-org/ui-finc-config/tree/v2.0.0) (2020-10-15)
* Increment `@folio/stripes` to `v5.0` and `react-router` to `v5.2` (and, bugfix, move it to peer)
* Use interface `finc-config/metadata-sources` `v3.0`
* Permission names are localizable (UIFC-218)

## [1.7.0](https://github.com/folio-org/ui-finc-config/tree/v1.7.0) (2020-09-08)
* Redesign of metadata-sources' contacts (UIFC-209)
* Add possibility to filter by contact's name (UIFC-184)
* Be compliant to language rules (UIFC-212)
* Increment interface version `finc-config/metadata-sources` to 3.0

## [1.6.0](https://github.com/folio-org/ui-finc-config/tree/v1.6.0) (2020-08-28)
* Replace deprecated `babel-polyfill` with `core-js` and `regenerator-runtime`
* Add navigation/link from finc-config to organizations app (UIFC-138)
* Improve accessibility (UIFC-151)
* Bugfix: Content not displayed for some metadata sources (UIFC-162)
* Add record last updated information to metadata sources and collections (UIFC-155)
* Add `selectedBy` to detail view of metadata collections (UIFC-173)
* Replace deprecated `@bigest/mirage` by `miragejs`
* Enable field search on description for sources & collections (UIFC-172)

## [1.5.0](https://github.com/folio-org/ui-finc-config/tree/v1.5.0) (2020-03-13)
* Add button "show all collections" for finc-config (UIFC-122)
* Select associated metadata source of a collection via plugin (UIFC-124)
* Migrate to final-form / react-final-form (UIFC-118)
* Improve required field solrMegaCollections (UIFC-131)
* Fix several accessibility issues (UIFC-132)
* Upgrade to Stripes v3 (UIFC-146)
* Bugfix: Fetch more when scrolling down
* Ticket field of metadata sources is validated and displayed as a link (UIFC-142)

## [1.4.0](https://github.com/folio-org/ui-finc-config/tree/v1.4.0) (2020-02-06)
* Default filter behaviour when switching between apps and/or tabs (UIFC-89)
* Set filters if clicking several times on the same navigation-tab (UIFC-110)
* Bugfix: Show more than 30 results (UIFC-112)
* Bugfix: Incorrect view of mdSource name  (UIFC-113)
* Add mdSource filter to collections of finc-config (UIFC-116)
* Bugfix: Refresh results and url after deleting search string (UIFC-109)
* Bugfix: Add arrow icon to header in list of results (UIFC-119)
* Centering forms and add footer with save and cancel (UIFC-120)
* Improve remove buttons (UFIC-121)

## [1.3.0](https://github.com/folio-org/ui-finc-config/tree/v1.3.0) (2020-01-14)
* Sort column "Source ID" numerically (UIFC-105)
* Bugfix: Horizontal scroll bar for contacts, incorrect display, changes (UIFC-107)
* Bugfix: Validate contacts (UIFC-108)
* Bugfix: Incorrect permission names (UIFC-103)
* List for metadata sources in edit view of metadata collection (UIFC-94)
* Use SearchAndSortQuery instead SearchAndSort (UIFC-93)

## [1.2.0](https://github.com/folio-org/ui-finc-config/tree/v1.2.0) (2019-10-07)
* Show name of metadata source in result list (UIFC-86)

## [1.1.0](https://github.com/folio-org/ui-finc-config/tree/v1.1.0) (2019-09-18)
* Unsaved changes confirmation dialog (UIFC-63)
* Required validation does not accept SourceID 0 (UIFC-65)
* GeneraNotes cant be saved (UIFC-64)
* change order of filter (UIFC-74)
* organizations plugin (UIFC-75)
* Rename permissions (UIFC-78)
* Set default filters for finc-config (UIFC-79)
* update dependencies; fixing warnings (UIFC-82)

## [1.0.0](https://github.com/folio-org/ui-finc-config/tree/v1.0.0) (2019-07-23)
* Add Isil-Setting to ui-finc-config (UIFC-28)
* Selected organization is not displayed when editing existing metadata source (UIFC-34)
* Add dashes to pathnames of UI (UIFC-31)
* Switch to ui-plugin-find-organization (UIFC-24)
* Add Bigtest to finc-config (UIFC-23)
* Add source-link from collection-details to source-details
* Replace tabs for fixing double scroll bar; cleaning up
* Show the name of the metadata-source-id in a metadata-collection
* Select a metadata-source in metadata-collection
* Add link to vendor-app
* Add detail-view and edit-view for metadata collections; add formatter for comma separated array elements in result list; working on validation for none empty array
* Add field-validations for metadata-source; cleaning up
* Add select-box to SearchAndSort of metadata source
* Add tabs to switch between sources and collections; fixing bugs
* Edit function for repeatable field contracts
* Basics for SearchAnsSort module
* New app created with stripes-cli

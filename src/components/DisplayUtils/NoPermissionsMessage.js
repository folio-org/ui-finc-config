import { FormattedMessage } from 'react-intl';

import { Layout } from '@folio/stripes/components';

const NoPermissionsMessage = () => (
  <Layout className="textCentered">
    <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
    <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
  </Layout>
);

export default NoPermissionsMessage;

import {
  get,
  startCase,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  PaneHeader,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

const ViewContainer = ({
  additionalProps,
  canEdit,
  handlers,
  isLoading,
  record,
  infoComponent: InfoComponent,
  idPrefix,
  recordPropKey,
  accordionConfig,
}) => {
  const editButton = useRef();
  const stripes = useStripes();

  const initialAccordionsState = accordionConfig.reduce((acc, { id }) => {
    acc[id] = false;
    return acc;
  }, {});

  const [accordionsState, setAccordionsState] = useState(initialAccordionsState);

  const handleExpandAll = (obj) => setAccordionsState(obj);

  const handleAccordionToggle = ({ id }) => {
    setAccordionsState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderEditPaneMenu = () => (
    <PaneMenu>
      {canEdit && (
        <Button
          aria-label={<FormattedMessage id="ui-finc-config.edit" />}
          buttonRef={editButton}
          buttonStyle="primary"
          id={`clickable-edit-${idPrefix}`}
          marginBottom0
          onClick={handlers.onEdit}
        >
          <FormattedMessage id="ui-finc-config.edit" />
        </Button>
      )}
    </PaneMenu>
  );

  const renderLoadingPaneHeader = () => (
    <PaneHeader
      dismissible
      onClose={handlers.onClose}
      paneTitle={<span data-test-collection-header-title>loading</span>}
    />
  );

  const renderDetailsPaneHeader = (label) => (
    <PaneHeader
      dismissible
      lastMenu={renderEditPaneMenu()}
      onClose={handlers.onClose}
      paneTitle={<span data-test-source-header-title>{label}</span>}
    />
  );

  const renderLoadingPane = () => (
    <Pane
      defaultWidth="40%"
      id={`pane-${idPrefix}details`}
      renderHeader={renderLoadingPaneHeader}
    >
      <Layout className="marginTop1">
        <Icon icon="spinner-ellipsis" width="10px" />
      </Layout>
    </Pane>
  );

  const label = get(record, 'label', <FormattedMessage id="ui-finc-config.noValue" />);

  if (isLoading) return renderLoadingPane();

  return (
    <Pane
      data-test-source-pane-details
      defaultWidth="40%"
      id={`pane-${idPrefix}details`}
      renderHeader={() => renderDetailsPaneHeader(label)}
    >
      <AccordionSet>
        <ViewMetaData
          metadata={get(record, 'metadata', {})}
          stripes={stripes}
        />
        <InfoComponent
          id={`${idPrefix}Info`}
          stripes={stripes}
          {...{ [recordPropKey]: record }}
        />
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={accordionsState}
              onToggle={handleExpandAll}
              setStatus={null}
            />
          </Col>
        </Row>

        {accordionConfig.map(({ id, labelId, Component }) => (
          <Accordion
            key={id}
            id={id}
            label={<FormattedMessage id={labelId} />}
            onToggle={handleAccordionToggle}
            open={accordionsState[id]}
          >
            <Component
              id={`${idPrefix}${startCase(id)}`}
              stripes={stripes}
              {...(additionalProps || {})}
              {...{ [recordPropKey]: record }}
            />
          </Accordion>
        ))}
      </AccordionSet>
    </Pane>
  );
};

ViewContainer.propTypes = {
  accordionConfig: PropTypes.arrayOf(PropTypes.shape({
    Component: PropTypes.elementType.isRequired,
    id: PropTypes.string.isRequired,
    labelId: PropTypes.string.isRequired,
  })).isRequired,
  additionalProps: PropTypes.object,
  canEdit: PropTypes.bool,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  idPrefix: PropTypes.string.isRequired,
  infoComponent: PropTypes.elementType.isRequired,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
  recordPropKey: PropTypes.string.isRequired,
};

export default ViewContainer;

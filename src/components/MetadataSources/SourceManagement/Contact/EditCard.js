import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';

import {
  Card,
  Tooltip,
  IconButton,
} from '@folio/stripes/components';

const EditCard = ({
  children,
  deleteButtonTooltipText,
  header,
  onDelete,
}) => {
  const renderDeleteButton = () => {
    return (
      deleteButtonTooltipText ?
        <Tooltip
          id={uniqueId('editcard')}
          text={deleteButtonTooltipText}
        >
          {({ ref, ariaIds }) => (
            <IconButton
              ref={ref}
              aria-labelledby={ariaIds.text}
              icon="trash"
              onClick={onDelete}
            />
          )}
        </Tooltip>
        :
        <IconButton
          icon="trash"
          onClick={onDelete}
        />
    );
  };

  return (
    <Card
      headerEnd={onDelete ? renderDeleteButton() : undefined}
      headerStart={<strong>{header}</strong>}
    >
      {children}
    </Card>
  );
};

EditCard.propTypes = {
  children: PropTypes.node.isRequired,
  deleteButtonTooltipText: PropTypes.node,
  header: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};

export default EditCard;

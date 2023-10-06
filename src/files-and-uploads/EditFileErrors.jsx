import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { ErrorAlert } from '@edx/frontend-lib-content-components';
import { RequestStatus } from '../data/constants';
import messages from './messages';

const EditFileErrors = ({
  errorMessages,
  addFileStatus,
  deleteFileStatus,
  updateFileStatus,
  // injected
  intl,
}) => (
  <>
    <ErrorAlert
      hideHeading={false}
      isError={addFileStatus === RequestStatus.FAILED}
    >
      <ul className="p-0">
        {errorMessages.add.map(message => (
          <li key={`add-error-${message}`} style={{ listStyle: 'none' }}>
            {intl.formatMessage(messages.errorAlertMessage, { message })}
          </li>
        ))}
      </ul>
    </ErrorAlert>
    <ErrorAlert
      hideHeading={false}
      isError={deleteFileStatus === RequestStatus.FAILED}
    >
      <ul className="p-0">
        {errorMessages.delete.map(message => (
          <li key={`delete-error-${message}`} style={{ listStyle: 'none' }}>
            {intl.formatMessage(messages.errorAlertMessage, { message })}
          </li>
        ))}
      </ul>
    </ErrorAlert>
    <ErrorAlert
      hideHeading={false}
      isError={updateFileStatus === RequestStatus.FAILED}
    >
      <ul className="p-0">
        {errorMessages.lock.map(message => (
          <li key={`lock-error-${message}`} style={{ listStyle: 'none' }}>
            {intl.formatMessage(messages.errorAlertMessage, { message })}
          </li>
        ))}
        {errorMessages.download.map(message => (
          <li key={`download-error-${message}`} style={{ listStyle: 'none' }}>
            {intl.formatMessage(messages.errorAlertMessage, { message })}
          </li>
        ))}
      </ul>
    </ErrorAlert>
  </>
);

EditFileErrors.propTypes = {
  errorMessages: PropTypes.shape({
    add: PropTypes.arrayOf(PropTypes.string).isRequired,
    delete: PropTypes.arrayOf(PropTypes.string).isRequired,
    lock: PropTypes.arrayOf(PropTypes.string).isRequired,
    download: PropTypes.arrayOf(PropTypes.string).isRequired,
    usageMetrics: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  addFileStatus: PropTypes.string.isRequired,
  deleteFileStatus: PropTypes.string.isRequired,
  updateFileStatus: PropTypes.string.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(EditFileErrors);
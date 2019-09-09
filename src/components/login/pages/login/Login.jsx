/* eslint-disable react/no-danger */
/*
 * Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Row, Button, Typography, Alert } from 'antd';
import Markdown from 'markdown-to-jsx';
import i18n from '@locale';
import { Input, countdown, ThreeDots } from '@components';
import loginController from './Login.controller';
import styles from './Login.module.less';
import { milliToHMSFormat } from '@appjs';

const { Text, Paragraph } = Typography;
// *************************************************************************************************
const SentCodeTypeView = ({ sentCodeType }) => {
  const options = {
    forceBlock: true,
    overrides: {
      p: {
        component: Paragraph,
        props: {
          type: 'secondary',
          className: styles.login_center,
        },
      },
    },
  };
  let msg;
  switch (sentCodeType) {
    case 'auth.sentCodeTypeApp':
      msg = i18n.t('login_enter_code_label_md');
      break;
    case 'auth.sentCodeTypeCall':
      msg = i18n.t('login_enter_call_code_label_md');
      break;
    default:
      msg = i18n.t('login_enter_sms_code_label_md');
      break;
  }

  // className={styles.login_smscode_lead}
  return (
    <Row className={styles.login_row}>
      <Markdown options={options}>{msg}</Markdown>
    </Row>
  );
};
const SentCodeType = React.memo(SentCodeTypeView);
// *************************************************************************************************
const ResendCodeView = ({ sentCodeType, progress, sendNext }) => {
  if (progress) {
    return (
      <Button type="link" className={styles.login_center}>
        <Text type="secondary">{i18n.t('login_code_requesting')}</Text>
        <ThreeDots height={20} width={20} className={styles.login_dots} />
      </Button>
    );
  }

  let title;
  if (sentCodeType === 'auth.codeTypeCall') {
    title = i18n.t('login_code_not_received_call');
  } else {
    title = i18n.t('login_code_not_received');
  }

  return (
    <Button type="link" onClick={sendNext} className={styles.login_center}>
      {title}
    </Button>
  );
};
const ResendCode = React.memo(ResendCodeView);
// *************************************************************************************************
// NextPendingView -> ResendCodeView
const NextPendingView = ({ sentCodeType, remaining, nextPendingTimeout }) => {
  const timeout = countdown(() => Date.now() + remaining);
  if (timeout === 0) {
    nextPendingTimeout();
  }
  const msg = `${(sentCodeType === 'auth.codeTypeCall'
    ? i18n.t('login_call_remaining')
    : i18n.t('login_code_remaining')) + milliToHMSFormat(timeout)}`;
  return (
    <Paragraph type="secondary" className={styles.login_center}>
      {msg}
    </Paragraph>
  );
};
const NextPending = React.memo(NextPendingView);
// *************************************************************************************************
const NextSendCodeView = ({
  sentCodeType,
  remaining,
  nextPendingTimeout,
  nextSentCodeType,
  nextPendingProgress,
  onResendCode,
}) => {
  return (
    <Row className={styles.login_row}>
      {remaining > 0 ? (
        <NextPending
          sentCodeType={sentCodeType}
          remaining={remaining}
          nextPendingTimeout={nextPendingTimeout}
        />
      ) : (
        <ResendCode
          sentCodeType={nextSentCodeType}
          progress={nextPendingProgress}
          sendNext={onResendCode}
        />
      )}
    </Row>
  );
};
const NextSendCode = React.memo(NextSendCodeView);
// *************************************************************************************************
// eslint-disable-next-line react/prop-types
const EditPhoneNumberView = ({ phoneCountry, phoneNumber, editPhone }) => {
  return (
    <>
      <Text strong className={styles.login_center}>
        <span>{phoneCountry}</span> <span>{phoneNumber}</span>
      </Text>
      <Button type="link" onClick={editPhone} className={styles.login_center}>
        {i18n.t('login_edit_number')}
      </Button>
    </>
  );
};
const EditPhoneNumber = React.memo(EditPhoneNumberView);
// *************************************************************************************************
const SendCodeView = ({ incorrectCode, onDataValueChanged }) => {
  return (
    <>
      <Text type="secondary" className={styles.login_center}>
        {i18n.t('login_number_input_placeholder')}
      </Text>
      <Input
        ref={input => input && input.focus()}
        className={styles.loging_input_code}
        error={incorrectCode}
        onChange={e => onDataValueChanged('phoneCode', e.target.value)}
      />
      {incorrectCode && (
        <Alert
          className={styles.login_err}
          message={i18n.t('login_code_incorrect')}
          type="error"
          banner
          showIcon={false}
        />
      )}
    </>
  );
};
const SendCode = React.memo(SendCodeView);
// *************************************************************************************************
const Login = ({ phoneCountry, phoneNumber, phoneCountryName, sentCodeResponse }) => {
  const { data, onResendCode, nextPendingTimeout, onDataValueChanged, editPhone } = loginController(
    {
      phoneCountry,
      phoneNumber,
      phoneCountryName,
      sentCodeResponse,
    },
  );

  return (
    <>
      <EditPhoneNumber
        phoneCountry={phoneCountry}
        phoneNumber={phoneNumber}
        editPhone={editPhone}
      />
      <SentCodeType sentCodeType={data.get('sentCodeType')} />
      <NextSendCode
        sentCodeType={data.get('sentCodeType')}
        remaining={data.get('remaining')}
        nextPendingTimeout={nextPendingTimeout}
        nextSentCodeType={data.get('nextSentCodeType')}
        nextPendingProgress={data.get('nextPendingProgress')}
        onResendCode={onResendCode}
      />
      <SendCode incorrectCode={data.get('incorrectCode')} onDataValueChanged={onDataValueChanged} />
    </>
  );
};

export default React.memo(Login);

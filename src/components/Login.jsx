import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>login</h1>
      <p>
        <Link to="/im">GOTO IM</Link>
        {` ss ${t('app.welcome')}`}
      </p>
    </div>
  );
}

export default Login;

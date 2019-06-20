import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.module.less';
import routes from './router';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(r => (
          <Route key={r.name} exact path={r.path} component={r.component} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default App;

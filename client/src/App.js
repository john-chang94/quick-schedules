import './App.css';
import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import Header from './components/header';
import SignIn from './components/signIn';

import AdminHome from './components/admin/home';
import AdminEmployees from './components/admin/employees';

import UserHome from './components/user/home';
import { verifyUser } from './services/auth';

function App() {
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      let tokenConfig = { headers: { 'token': token } };
      verifyUser(tokenConfig);
    }
  }, [])

  return (
    <div>
      <Header />
      <div className="container">
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <Route exact path={ROUTES.SIGN_IN} component={SignIn} />

              <Route path={ROUTES.ADMIN_HOME} component={AdminHome} />
              <Route path={ROUTES.ADMIN_EMPLOYEES} component={AdminEmployees} />

              <Route path={ROUTES.USER_HOME} component={UserHome} />
            </Switch>
          </Suspense>
        </Router>
      </div>
    </div>
  );
}

export default App;

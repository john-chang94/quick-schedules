import './App.css';
import { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import AdminSignIn from './components/admin/signIn';
import AdminHome from './components/admin/home';
import AdminEmployees from './components/admin/employees';

import UserSignIn from './components/user/signIn';
import UserHome from './components/user/home';

function App() {
  return (
    <div className="container">
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route exact path={ROUTES.ADMIN_SIGN_IN} component={AdminSignIn} />
            <Route path={ROUTES.ADMIN_HOME} component={AdminHome} />
            <Route path={ROUTES.ADMIN_EMPLOYEES} component={AdminEmployees} />

            <Route exact path={ROUTES.USER_SIGN_IN} component={UserSignIn} />
            <Route path={ROUTES.USER_HOME} component={UserHome} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;

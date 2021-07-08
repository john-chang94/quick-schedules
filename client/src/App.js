import './App.css';
import { Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import { isAuthenticated, verifyUser } from './services/auth';
import { UserContext } from './contexts/userContext';

import Header from './components/header';
import SignIn from './components/signIn';

import AdminHome from './components/admin/home';
import AdminEmployees from './components/admin/employees';
import AdminEmployee from './components/admin/employee';
import AdminNewEmployee from './components/admin/newEmployee';
import AdminSchedules from './components/admin/schedules';

import UserHome from './components/user/home';

function App() {
  const { setVerifiedUser } = useContext(UserContext);

  useEffect(() => {
    async function getVerifiedUser() {
      const tokenConfig = isAuthenticated();
      if (tokenConfig) {
        const verifiedUser = await verifyUser(tokenConfig);
        setVerifiedUser(verifiedUser); // Set verified user in context for header
      }
    }

    getVerifiedUser();
  }, [])

  return (
    <div>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Header />
          <div className="container">
            <Switch>
              <Route exact path={ROUTES.SIGN_IN} component={SignIn} />

              <Route path={ROUTES.ADMIN_HOME} component={AdminHome} />
              <Route exact path={ROUTES.ADMIN_EMPLOYEES} component={AdminEmployees} />
              <Route path={ROUTES.ADMIN_NEW_EMPLOYEE} component={AdminNewEmployee} />
              <Route path={ROUTES.ADMIN_EMPLOYEE} component={AdminEmployee} />
              <Route path={ROUTES.ADMIN_SCHEDULES} component={AdminSchedules} />

              <Route path={ROUTES.USER_HOME} component={UserHome} />
            </Switch>
          </div>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;

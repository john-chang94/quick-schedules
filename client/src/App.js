import './App.css';
import { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import { isAuthenticated, verifyUser } from './services/auth';
import { UserContext } from './contexts/userContext';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Header from './components/header';
import SignIn from './components/signIn';

import AdminHome from './components/admin/home';
import AdminEmployees from './components/admin/employees';
import AdminEmployee from './components/admin/employee';
import AdminNewEmployee from './components/admin/newEmployee';
import AdminSchedules from './components/admin/schedules';
import AdminRequests from './components/admin/requests';
import AdminStore from './components/admin/store';

import UserHome from './components/user/home';
import UserProfile from './components/user/profile';
import UserAvailability from './components/user/availability';
import UserRequests from './components/user/requests';
import UserSchedules from './components/user/schedules';
import AdminSignIn from './components/adminSignIn';

import ProtectedRoute from './helpers/protectedRoute';
import UserRoute from './helpers/userRoute';
import IsLoaded from './isLoaded';

function App() {
  const { verifiedUser, setVerifiedUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getVerifiedUser() {
      const tokenConfig = isAuthenticated();
      if (tokenConfig) {
        const verifiedUser = await verifyUser(tokenConfig);
        setVerifiedUser(verifiedUser); // Set verified user in context for header
      }
      setIsLoading(false);
    }

    getVerifiedUser();
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <Router>
        <IsLoaded isLoading={isLoading} children>
          <Header />
          <div className="container">
            <Switch>
              <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
              <Route exact path={ROUTES.ADMIN_SIGN_IN} component={AdminSignIn} />

              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_HOME} component={AdminHome} />
              <ProtectedRoute exact user={verifiedUser} path={ROUTES.ADMIN_EMPLOYEES} component={AdminEmployees} />
              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_NEW_EMPLOYEE} component={AdminNewEmployee} />
              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_EMPLOYEE} component={AdminEmployee} />
              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_SCHEDULES} component={AdminSchedules} />
              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_REQUESTS} component={AdminRequests} />
              <ProtectedRoute user={verifiedUser} path={ROUTES.ADMIN_STORE} component={AdminStore} />

              <UserRoute user={verifiedUser} path={ROUTES.USER_HOME} component={UserHome} />
              <UserRoute user={verifiedUser} path={ROUTES.USER_PROFILE} component={UserProfile} />
              <UserRoute user={verifiedUser} path={ROUTES.USER_AVAILABILITY} component={UserAvailability} />
              <UserRoute user={verifiedUser} path={ROUTES.USER_REQUESTS} component={UserRequests} />
              <UserRoute user={verifiedUser} path={ROUTES.USER_SCHEDULES} component={UserSchedules} />
            </Switch>
          </div>
        </IsLoaded>
      </Router>
    </div>
  );
}

export default App;

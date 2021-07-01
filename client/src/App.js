import './App.css';
import { Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import { verifyUser } from './services/auth';
import { UserContext } from './contexts/userContext';

import Header from './components/header';
import SignIn from './components/signIn';

import AdminHome from './components/admin/home';
import AdminEmployees from './components/admin/employees';

import UserHome from './components/user/home';

function App() {
  const { setVerifiedUser } = useContext(UserContext);

  useEffect(() => {
    async function getVerifiedUser() {
      const token = sessionStorage.getItem('token');
      if (token) {
        let tokenConfig = { headers: { 'token': token } };
        const verifiedUser = await verifyUser(tokenConfig);
        setVerifiedUser(verifiedUser); // Set verified user in context for header
      }
    }
    
    getVerifiedUser()
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

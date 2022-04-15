import "./Colors.css";
import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import { useUser } from "./contexts/userContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Header from "./components/header";
import Navbar from "./components/navbar";
import SignIn from "./components/signIn";
import AdminSignIn from "./components/adminSignIn";

import AdminEmployees from "./components/admin/employees";
import AdminEmployee from "./components/admin/employee";
import AdminNewEmployee from "./components/admin/newEmployee";
import AdminSchedules from "./components/admin/schedules";
import AdminRequests from "./components/admin/requests";
import AdminStore from "./components/admin/store";

import UserProfile from "./components/user/profile";
import UserAvailability from "./components/user/availability";
import UserRequests from "./components/user/requests";
import UserSchedules from "./components/user/schedules";

import ProtectedRoute from "./helpers/protectedRoute";
import UserRoute from "./helpers/userRoute";
import AuthRoute from "./helpers/authRoute";

function App() {
  const { verifiedUser } = useUser();

  return (
    <Router>
      <Header />
      <div className={`relative ${verifiedUser && "container-grid"}`}>
        <Navbar />
        <div className="container">
          <div className="container-inner">
            <Switch>
              <AuthRoute
                user={verifiedUser}
                exact
                path={ROUTES.SIGN_IN}
                component={SignIn}
              />
              <AuthRoute
                user={verifiedUser}
                exact
                path={ROUTES.ADMIN_SIGN_IN}
                component={AdminSignIn}
              />

              <ProtectedRoute
                exact
                user={verifiedUser}
                path={ROUTES.ADMIN_EMPLOYEES}
                component={AdminEmployees}
              />
              <ProtectedRoute
                user={verifiedUser}
                path={ROUTES.ADMIN_NEW_EMPLOYEE}
                component={AdminNewEmployee}
              />
              <ProtectedRoute
                user={verifiedUser}
                path={ROUTES.ADMIN_EMPLOYEE}
                component={AdminEmployee}
              />
              <ProtectedRoute
                user={verifiedUser}
                path={ROUTES.ADMIN_SCHEDULES}
                component={AdminSchedules}
              />
              <ProtectedRoute
                user={verifiedUser}
                path={ROUTES.ADMIN_REQUESTS}
                component={AdminRequests}
              />
              <ProtectedRoute
                user={verifiedUser}
                path={ROUTES.ADMIN_STORE}
                component={AdminStore}
              />

              <UserRoute
                user={verifiedUser}
                path={ROUTES.USER_SCHEDULES}
                component={UserSchedules}
              />
              <UserRoute
                user={verifiedUser}
                path={ROUTES.USER_REQUESTS}
                component={UserRequests}
              />
              <UserRoute
                user={verifiedUser}
                path={ROUTES.USER_AVAILABILITY}
                component={UserAvailability}
              />
              <UserRoute
                user={verifiedUser}
                path={ROUTES.USER_PROFILE}
                component={UserProfile}
              />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

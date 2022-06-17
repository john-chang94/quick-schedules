import "./Colors.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import { useUser } from "./contexts/userContext";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import SignIn from "./pages/Auth/SignIn";
import AdminSignIn from "./pages/Auth/AdminSignIn";

import AdminEmployees from "./pages/Admin/Employees/Employees";
import AdminEmployee from "./pages/Admin/Employee/Employee";
import AdminNewEmployee from "./pages/Admin/NewEmployee/NewEmployee";
import AdminSchedules from "./pages/Admin/Schedules/Schedules";
import AdminRequests from "./pages/Admin/Requests/Requests";
import AdminStore from "./pages/Admin/Store/Store";

import UserProfile from "./pages/User/Profile/Profile";
import UserAvailability from "./components/user/availability";
import UserRequests from "./components/user/requests";
import UserSchedules from "./components/user/schedules";

import ProtectedRoute from "./helpers/protectedRoute";
import UserRoute from "./helpers/userRoute";
import AuthRoute from "./helpers/authRoute";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const { verifiedUser } = useUser();

  return (
    <Router>
      <Header />
      <div
        className={`relative
        ${
          verifiedUser && // Use this grid style if signed in
          "container-grid"
        }`}
      >
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
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

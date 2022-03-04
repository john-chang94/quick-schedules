import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function AuthRoute({ user, component: Component, ...rest }) {
    return (
        <Route {...rest} render={({ location }) => {
            if (user && !user.is_admin) {
                return (
                    <Redirect to={{
                        pathname: ROUTES.USER_SCHEDULES,
                        state: { from: location }
                    }}
                    />
                );
            } 
            else if (user && user.is_admin) {
                return (
                    <Redirect to={{
                        pathname: ROUTES.ADMIN_EMPLOYEES,
                        state: { from: location }
                    }}
                    />
                );
            }
            else {
                return <Component />;
            }
        }}
        />
    )
}
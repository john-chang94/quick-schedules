import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function ProtectedRoute({ user, component: Component, ...rest }) {
    return (
        // ...rest is the path from props
        <Route {...rest} render={({ location }) => {
            if (user && user.is_admin) {
                return <Component />;
            } else {
                return (
                    <Redirect to={{
                        pathname: ROUTES.ADMIN_SIGN_IN,
                        state: { from: location }
                    }}
                    />
                );
            }
        }}
        />
    )
}
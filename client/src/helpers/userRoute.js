import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function UserRoute({ user, component: Component, ...rest }) {
    return (
        <Route {...rest} render={({ location }) => {
            if (user && !user.is_admin) {
                return <Component />;
            } else {
                return (
                    <Redirect to={{
                        pathname: ROUTES.SIGN_IN,
                        state: { from: location }
                    }}
                    />
                );
            }
        }}
        />
    )
}
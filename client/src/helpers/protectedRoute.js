import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { UserContext } from '../contexts/userContext';

export default function ProtectedRoute({ user, component: Component, ...rest }) {
    const { setVerifiedUser } = useContext(UserContext);
    
    return (
        <Route {...rest} render={({ location }) => {
            if (user && user.is_admin) {
                return <Component />;
            }
            if (user && !user.is_admin) {
                return (
                    <div className="text-center mt-5">
                        Unauthorized
                    </div>
                )
            }
            else {
                sessionStorage.removeItem('token');
                setVerifiedUser(null);
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
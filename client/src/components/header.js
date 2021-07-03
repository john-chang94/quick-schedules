import { useContext } from 'react';
import { useHistory } from 'react-router';
import * as ROUTES from '../constants/routes';
import { UserContext } from '../contexts/userContext';

export default function Header() {
    const { verifiedUser, setVerifiedUser } = useContext(UserContext);
    const history = useHistory();

    const handleSignOut = () => {
        sessionStorage.removeItem('token');
        setVerifiedUser(null); // Remove verified user from context
        history.push(ROUTES.SIGN_IN);
    }

    return (
        <nav>
            {
                verifiedUser &&
                <div className="flex">
                    <div className="mr-5">
                        <p className="off-white">Welcome, {verifiedUser && verifiedUser.first_name}</p>
                    </div>
                    <div className="mr-8 pointer-no-u" onClick={handleSignOut}>
                        <p className="off-white">Sign Out <i className="fas fa-sign-out-alt text-6"></i></p>
                    </div>
                </div>
            }
        </nav>
    )
}
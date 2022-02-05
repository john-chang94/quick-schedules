import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as ROUTES from '../constants/routes';
import { UserContext } from '../contexts/userContext';

export default function Header() {
    const [width, setWidth] = useState(null);
    const { verifiedUser, setVerifiedUser } = useContext(UserContext);
    const history = useHistory();

    const handleSignOut = () => {
        sessionStorage.removeItem('token');
        setVerifiedUser(null); // Remove verified user from context
        if (verifiedUser.is_admin) history.push(ROUTES.ADMIN_SIGN_IN);
        else history.push(ROUTES.SIGN_IN);
    }

    const setWindowWidth = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener('resize', setWindowWidth);

        return () => window.removeEventListener('resize', setWindowWidth);
    }, [])

    return (
        <nav>
            {
                verifiedUser &&
                <div className="flex container">
                    <div className="mr-5">
                        <p className="off-white">Welcome, {verifiedUser && verifiedUser.first_name}</p>
                    </div>
                    <div className="pointer-no-u" style={{ marginTop: '2px' }} onClick={handleSignOut}>
                        <p className="off-white"><i className="fas fa-sign-out-alt text-6"></i></p>
                    </div>
                </div>
            }
        </nav>
    )
}
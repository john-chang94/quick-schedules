import { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import * as ROUTES from '../constants/routes';
import { UserContext } from '../contexts/userContext';
import { signIn } from '../services/auth';

export default function AdminSignIn() {
    const history = useHistory();
    const { setVerifiedUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = email === '' || password === '';

    const handleSignIn = async (e) => {
        e.preventDefault();

        const credentials = { email, password };
        const res = await signIn(credentials);

        if (res.error) setError(res.error);

        if (res.token) {
            if (res.user.is_admin) {
                setVerifiedUser(res.user); // Set verified user in context for header
                sessionStorage.setItem('token', res.token);
                history.push(ROUTES.ADMIN_HOME);
            }
            else if (!res.user.is_admin) {
                alert('Please sign in through the user portal');
                history.push(ROUTES.SIGN_IN);
            }
        }
    }

    return (
        <div className="flex flex-center vh-80">
            <div className="w-100">
                <h2 className="mb-2">Sign In</h2>
                <form onSubmit={handleSignIn} className="flex flex-col flex-center">
                    <div className="mb-1 w-100">
                        <p>Email</p>
                        <input type="email" className="form-input" onChange={({ target }) => setEmail(target.value)} />
                    </div>
                    <div className="mb-3 w-100">
                        <p>Password</p>
                        <input type="password" className="form-input" onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <div>
                        <button className={`btn-lg ${!isInvalid && 'btn-hovered'}`} disabled={isInvalid}>Sign In</button>
                    </div>
                    {error ? <p className="mt-2 red">{error}</p> : null}
                </form>
            </div>
        </div>
    )
}
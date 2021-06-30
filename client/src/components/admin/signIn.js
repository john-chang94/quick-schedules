import { useState } from 'react';
import { useHistory } from 'react-router';
import * as ROUTES from '../../constants/routes';
import { signIn } from '../../services/auth';

export default function AdminSignIn() {
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = email === '' || password === '';

    const handleSignIn = async (e) => {
        e.preventDefault();

        const credentials = { email, password };
        const res = await signIn(credentials);

        if (res.error) setError(res.error);
        else if (res.user.is_admin) history.push(ROUTES.ADMIN_HOME);
        else if (!res.user.is_admin) history.push(ROUTES.USER_SIGN_IN);
    }

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
                <div>
                    <label>Email</label>
                    <input type="email" onChange={({ target }) => setEmail(target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={({ target }) => setPassword(target.value)} />
                </div>
                <div>
                    <button>Sign In</button>
                </div>
            </form>

            {error ? <p>{error}</p> : null}
        </div>
    )
}
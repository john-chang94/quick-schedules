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
        <div className="w-100 flex flex-center vh-90">
            <div>
                <h2 className="mb-2">Sign In</h2>
                <form onSubmit={handleSignIn} className="flex flex-col flex-center">
                    <div className="mb-1">
                        <p>Email</p>
                        <input type="email" className="input-lg" onChange={({ target }) => setEmail(target.value)} />
                    </div>
                    <div className="mb-3">
                        <p>Password</p>
                        <input type="password" className="input-lg" onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <div>
                        <button className="btn-lg pointer">Sign In</button>
                    </div>
                    {error ? <p className="mt-2 text-red">{error}</p> : null}
                </form>

            </div>
        </div>
    )
}
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import { editPassword, fetchUser } from '../../services/users';
import { UserContext } from '../../contexts/userContext';

export default function AdminEmployee() {
    const { u_id } = useParams();
    const { verifiedUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    
    const [password, setPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [confirm_new_password, setConfirmNewPassword] = useState('');
    
    const isInvalid = password === '' || new_password === '' || confirm_new_password === '';

    const handleUpdatePassword = async () => {
        const tokenConfig = isAuthenticated();
        const body = { password, new_password, confirm_new_password };

        const res = await editPassword(u_id, body, tokenConfig);
        if (res.error) setError(res.error);
    }

    useEffect(() => {
        async function getUser() {
            const tokenConfig = isAuthenticated();
            const user = await fetchUser(u_id, tokenConfig);
            setUser(user);
        }

        getUser();
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Back
                </Link>
            </div>
            {
                user &&
                <div>
                    <div style={{ height: '450px' }} className="flex flex-col justify-evenly">
                        <div>
                            <h4>Name</h4>
                            <p>{user.first_name} {user.last_name}</p>
                        </div>
                        <div>
                            <h4>Role</h4>
                            <p>{user.title}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h4>Phone</h4>
                            <p>{user.phone}</p>
                        </div>
                        <div>
                            <h4>Hourly Pay</h4>
                            <p>{user.hourly_pay}</p>
                        </div>
                        <div>
                            <h4>Started At</h4>
                            <p>{new Date(user.started_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4>Updated At</h4>
                            <p>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    {
                        verifiedUser && verifiedUser.u_id === user.u_id &&
                        <div>
                            <hr />
                            <h4 className="mt-3">Update Password</h4>
                            <div style={{ height: '200px' }} className="flex flex-col justify-evenly">
                                <div>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Current Password"
                                        onChange={({ target }) => setPassword(target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="New Password"
                                        onChange={({ target }) => setNewPassword(target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirm New Password"
                                        onChange={({ target }) => setConfirmNewPassword(target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    className={`btn-med ${isInvalid ? '' : 'btn-hovered'}`}
                                    onClick={handleUpdatePassword}
                                    disabled={isInvalid}    
                                >
                                    Update
                                </button>
                            </div>
                            {error ? <p className="mt-2 red">{error}</p> : null}
                        </div>
                    }
                </div>
            }
        </div>
    )
}
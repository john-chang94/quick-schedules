import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import { fetchUser, editPassword, editUserGeneral } from '../../services/users';
import Loader from 'react-loader-spinner';

export default function UserProfile() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [u_id, setUid] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [confirm_new_password, setConfirmNewPassword] = useState('');

    const [showEditGeneral, setShowEditGeneral] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        const body = { password, new_password, confirm_new_password };

        const res = await editPassword(u_id, body, tokenConfig);
        if (res.error) {
            setError(res.error);
            setIsUpdating(false);
        }
        else {
            setError('');
            setSuccess('Password changed successfully');
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsUpdating(false);
        }
    }

    const handleUpdateUserGeneral = async () => {
        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        const body = { first_name, last_name, email, phone };

        const res = await editUserGeneral(u_id, body, tokenConfig);

        if (res.error) {
            setError(res.error);
            setIsUpdating(false);
        } else {
            const user = await fetchUser(u_id, tokenConfig);
            setError('');
            setUser(user);
            setShowEditGeneral(false);
            setIsUpdating(false);
        }
    }

    const renderUserGeneral = () => (
        <div className="my-2">
            <div className="py-1">
                <h4>Name</h4>
                <p>{user.first_name} {user.last_name}</p>
            </div>
            <div className="py-1">
                <h4>Email</h4>
                <p>{user.email}</p>
            </div>
            <div className="py-1">
                <h4>Phone</h4>
                <p>{user.phone}</p>
            </div>
            <div className="py-1">
                <button className="btn-med btn-hovered" onClick={() => setShowEditGeneral(true)}>Edit</button>
            </div>
        </div>
    )

    const renderEditGeneral = () => (
        <div className="my-2">
            <div className="py-1">
                <p>First Name</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={first_name}
                    onChange={({ target }) => setFirstName(target.value)}
                />
            </div>
            <div className="py-1">
                <p>Last Name</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={last_name}
                    onChange={({ target }) => setLastName(target.value)}
                />
            </div>
            <div className="py-1">
                <p>Email</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={email}
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div className="py-1">
                <p>Phone</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={phone}
                    onChange={({ target }) => setPhone(target.value)}
                />
            </div>
            <div className="py-1">
                <button className="btn-med btn-hovered" disabled={isUpdating} onClick={() => handleUpdateUserGeneral()}>Save</button>
                <button className="btn-med btn-hovered ml-5" disabled={isUpdating} onClick={() => setShowEditGeneral(false)}>Cancel</button>
            </div>
        </div>
    )

    const renderEditPassword = () => (
        <div>
            <h4 className="mt-2">Update Password</h4>
            <form onSubmit={handleUpdatePassword}>
                <div className="py-2">
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        placeholder="Current Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <div className="py-2">
                    <input
                        type="password"
                        className="form-input"
                        value={new_password}
                        placeholder="New Password"
                        onChange={({ target }) => setNewPassword(target.value)}
                    />
                </div>
                <div className="py-2">
                    <input
                        type="password"
                        className="form-input"
                        value={confirm_new_password}
                        placeholder="Confirm New Password"
                        onChange={({ target }) => setConfirmNewPassword(target.value)}
                    />
                </div>
                <div className="py-2">
                    <button
                        className={`btn-med ${isUpdating ? '' : 'btn-hovered'}`}
                        disabled={isUpdating}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )

    useEffect(() => {
        async function getData() {
            // verifiedUser is null on init load so add as dependency and check it again to fetch data
            if (verifiedUser) {
                const user = await fetchUser(verifiedUser.u_id);
                setUid(user.u_id);
                setUser(user);
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setEmail(user.email);
                setPhone(user.phone);
                setIsLoading(false);
            }
        }

        getData();
    }, [verifiedUser])

    return (
        <div>
            <div>
                <Link to={ROUTES.USER_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>
            {
                isLoading
                    ? <div className="text-center" style={{ marginTop: '70px' }}>
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div>
                    : <div>
                        {
                            user &&
                            <div>
                                {
                                    showEditGeneral
                                        ? renderEditGeneral()
                                        : renderUserGeneral()

                                }
                                <hr />
                                {
                                    renderEditPassword()
                                }

                                {error ? <p className="red">{error}</p> : null}
                                {success ? <p className="green">{success}</p> : null}
                            </div>
                        }
                    </div>
            }
        </div>
    )
}
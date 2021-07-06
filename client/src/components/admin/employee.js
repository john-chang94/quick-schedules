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

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [role, setRole] = useState('');
    const [hourly_pay, setHourlyPay] = useState('');
    const [started_at, setStartedAt] = useState('');
    const [updated_at, setUpdatedAt] = useState('');

    const [showEditGeneral, setShowEditGeneral] = useState(false);
    const [showEditInfo, setShowEditInfo] = useState(false);

    const [password, setPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [confirm_new_password, setConfirmNewPassword] = useState('');

    const isInvalid = password === '' || new_password === '' || confirm_new_password === '';

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const tokenConfig = isAuthenticated();
        const body = { password, new_password, confirm_new_password };

        const res = await editPassword(u_id, body, tokenConfig);
        if (res.error) setError(res.error);
    }

    const renderUserGeneral = () => (
        <div>
            <div>
                <h4>Name</h4>
                <p>{user.first_name} {user.last_name}</p>
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
                <button className="btn-med btn-hovered" onClick={() => setShowEditGeneral(true)}>Edit</button>
            </div>
        </div>
    )

    const renderUserInfo = () => (
        <div>
            <div>
                <h4>Role</h4>
                <p>{user.title}</p>
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
            <div>
                <button className="btn-med btn-hovered" onClick={() => setShowEditInfo(true)}>Edit</button>
            </div>
        </div>
    )

    const renderEditGeneral = () => (
        <div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.first_name}
                    onChange={({ target }) => setFirstName(target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.last_name}
                    onChange={({ target }) => setLastName(target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.email}
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.phone}
                    onChange={({ target }) => setPhone(target.value)}
                />
            </div>
            <div>
                <button>Save</button>
                <button className="btn-med btn-hovered" onClick={() => setShowEditGeneral(false)}>Cancel</button>
            </div>
        </div>
    )

    const renderEditInfo = () => (
        <div>
            <div>
                <select>
                    <option value=""></option>
                </select>
                {/* <input
                    type="text"
                    className="form-input"
                    defaultValue={user.title}
                    onChange={({ target }) => setRole(target.value)}
                /> */}
            </div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.hourly_pay}
                    onChange={({ target }) => setHourlyPay(target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.started_at}
                    onChange={({ target }) => setStartedAt(target.value)}
                />
            </div>
            {/* <div>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={user.updated_at}
                    onChange={({ target }) => setUpdatedAt(target.value)}
                />
            </div> */}
            <div>
                <button>Save</button>
                <button className="btn-med btn-hovered" onClick={() => setShowEditInfo(false)}>Cancel</button>
            </div>
        </div>
    )

    const renderEditPassword = () => (
        <div>
            <h4 className="mt-2">Update Password</h4>
            <form onSubmit={handleUpdatePassword} style={{ height: '230px' }} className="flex flex-col justify-evenly">
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
                <div>
                    <button
                        className={`btn-med ${isInvalid ? '' : 'btn-hovered'}`}
                        disabled={isInvalid}
                    >
                        Update
                    </button>
                </div>
            </form>
            {error ? <p className="red">{error}</p> : null}
        </div>
    )

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
                    {
                        showEditGeneral
                            ? renderEditGeneral()
                            : renderUserGeneral()

                    }
                    <hr />
                    {
                        showEditInfo
                            ? renderEditInfo()
                            : renderUserInfo()
                    }
                    <hr />
                    {
                        verifiedUser && verifiedUser.u_id === user.u_id &&
                        renderEditPassword()
                    }
                </div>
            }
        </div>
    )
}
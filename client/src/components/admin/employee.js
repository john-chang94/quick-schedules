import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import { editPassword, editUserGeneral, editUserInfo, fetchUser } from '../../services/users';
import { UserContext } from '../../contexts/userContext';
import { fetchRoles } from '../../services/roles';
import Loader from 'react-loader-spinner';

export default function AdminEmployee() {
    const { u_id } = useParams();
    const { verifiedUser } = useContext(UserContext);

    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [role_id, setRoleId] = useState('');
    const [hourly_pay, setHourlyPay] = useState('');
    const [started_at, setStartedAt] = useState('');

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
        if (res.error) {
            setError(res.error);
        }
        else {
            setError('');
            setSuccess('Password changed successfully');
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }

    const handleUpdateUserGeneral = async () => {
        const tokenConfig = isAuthenticated();
        const body = { first_name, last_name, email, phone };

        const res = await editUserGeneral(u_id, body, tokenConfig);

        if (res.error) {
            setError(res.error);
        } else {
            const user = await fetchUser(u_id, tokenConfig);
            setError('');
            setUser(user);
            setShowEditGeneral(false);
        }
    }

    const handleUpdateUserInfo = async () => {
        const tokenConfig = isAuthenticated();
        const body = { role_id, hourly_pay, started_at, updated_at: new Date(Date.now()).toLocaleDateString() };

        const res = await editUserInfo(u_id, body, tokenConfig);

        if (res.error) {
            setError(res.error);
        } else {
            const user = await fetchUser(u_id, tokenConfig);
            setError('');
            setUser(user);
            setShowEditInfo(false);
        }
    }

    const renderUserGeneral = () => (
        <div style={{ height: '200px' }} className="mx-2 flex flex-col justify-evenly">
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
        <div style={{ height: '250px' }} className="mx-2 flex flex-col justify-evenly">
            <div>
                <h4>Role</h4>
                <p>{user.title}</p>
            </div>
            <div>
                <h4>Hourly Pay</h4>
                <p>{verifiedUser.level <= user.level ? user.hourly_pay : 'N/A'}</p>
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
                <button
                    className="btn-med btn-hovered"
                    onClick={() => setShowEditInfo(true)}
                    disabled={verifiedUser.level > user.level}
                >
                    Edit
                </button>
            </div>
        </div>
    )

    const renderEditGeneral = () => (
        <div style={{ height: '330px' }} className="mx-2 flex flex-col justify-evenly">
            <div>
                <p>First Name</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={first_name}
                    onChange={({ target }) => setFirstName(target.value)}
                />
            </div>
            <div>
                <p>Last Name</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={last_name}
                    onChange={({ target }) => setLastName(target.value)}
                />
            </div>
            <div>
                <p>Email</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={email}
                    onChange={({ target }) => setEmail(target.value)}
                />
            </div>
            <div>
                <p>Phone</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={phone}
                    onChange={({ target }) => setPhone(target.value)}
                />
            </div>
            <div>
                <button className="btn-med btn-hovered" onClick={() => handleUpdateUserGeneral()}>Save</button>
                <button className="btn-med btn-hovered ml-5" onClick={() => setShowEditGeneral(false)}>Cancel</button>
            </div>
        </div>
    )

    const renderEditInfo = () => (
        <div style={{ height: '280px' }} className="mx-2 flex flex-col justify-evenly">
            <div>
                <p>Role</p>
                <select defaultValue={user.role_id} onChange={({ target }) => setRoleId(parseInt(target.value))}>
                    {
                        roles && roles.map((role, i) => (
                            <option
                                key={i}
                                value={role.role_id}
                            >
                                {role.title}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div>
                <p>Hourly Pay</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={hourly_pay}
                    onChange={({ target }) => setHourlyPay(target.value)}
                />
            </div>
            <div>
                <p>Started At</p>
                <input
                    type="text"
                    className="form-input"
                    defaultValue={new Date(started_at).toLocaleDateString()}
                    onChange={({ target }) => setStartedAt(target.value)}
                />
            </div>
            <div>
                <button className="btn-med btn-hovered" onClick={() => handleUpdateUserInfo()}>Save</button>
                <button className="btn-med btn-hovered ml-5" onClick={() => setShowEditInfo(false)}>Cancel</button>
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
                        value={password}
                        placeholder="Current Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="form-input"
                        value={new_password}
                        placeholder="New Password"
                        onChange={({ target }) => setNewPassword(target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        className="form-input"
                        value={confirm_new_password}
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
        </div>
    )

    useEffect(() => {
        async function getData() {
            const tokenConfig = isAuthenticated();

            const user = await fetchUser(u_id, tokenConfig);
            const roles = await fetchRoles(tokenConfig);
            setUser(user);
            setRoles(roles);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setPhone(user.phone);
            setRoleId(user.role_id);
            setHourlyPay(user.hourly_pay);
            setStartedAt(user.started_at);
            setIsLoading(false);
        }
        getData();
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Back
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
                                    showEditInfo
                                        ? renderEditInfo()
                                        : renderUserInfo()
                                }
                                <hr />
                                {
                                    verifiedUser && verifiedUser.u_id === user.u_id &&
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
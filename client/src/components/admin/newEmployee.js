import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import { fetchRoles } from '../../services/roles';
import { createUser } from '../../services/auth';

export default function AdminNewEmployee() {
    const [roles, setRoles] = useState(null);
    const [error, setError] = useState('');

    const [role_id, setRoleId] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [hourly_pay, setHourlyPay] = useState('');
    const [started_at, setStartedAt] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tokenConfig = isAuthenticated();
        const body = { role_id, first_name, last_name, email, phone, password, hourly_pay, started_at };

        const res = await createUser(body, tokenConfig);
        if (res.error) {
            setError(res.error);
        } else {
            setError('');
            setRoleId('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setHourlyPay('');
        }
    }

    useEffect(() => {
        async function getRoles() {
            const roles = await fetchRoles();
            setRoles(roles);
        }

        getRoles();
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Back
                </Link>
            </div>
            <form onSubmit={handleSubmit} style={{ height: '630px' }} className="flex flex-col justify-evenly mt-2">
                <div>
                    <p>First Name</p>
                    <input type="text" className="form-input" onChange={({ target }) => setFirstName(target.value)} />
                </div>
                <div>
                    <p>Last Name</p>
                    <input type="text" className="form-input" onChange={({ target }) => setLastName(target.value)} />
                </div>
                <div>
                    <p>Email</p>
                    <input type="email" className="form-input" onChange={({ target }) => setEmail(target.value)} />
                </div>
                <div>
                    <p>Phone</p>
                    <input type="text" className="form-input" onChange={({ target }) => setPhone(target.value)} />
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" className="form-input" onChange={({ target }) => setPassword(target.value)} />
                </div>
                <div>
                    <p>Hourly Pay</p>
                    <input type="text" className="form-input" onChange={({ target }) => setHourlyPay(target.value)} />
                </div>
                <div>
                    <p>Starting Date</p>
                    <input type="date" className="form-input" onChange={({ target }) => setStartedAt(target.value)} />
                </div>
                <div>
                    <p>Role</p>
                    <select onChange={({ target }) => setRoleId(parseInt(target.value))}>
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
                    <button className="btn-med btn-hovered">Submit</button>
                </div>
            </form>
            {error ? <p className="red">{error}</p> : null}
        </div>
    )
}
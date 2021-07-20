import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchAllUsers } from '../../services/users';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';

export default function AdminEmployees() {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [width, setWidth] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickUser = (u_id) => {
        history.push(`${ROUTES.ADMIN_EMPLOYEES}/${u_id}`);
    }

    const handleNewEmployee = () => {
        history.push(ROUTES.ADMIN_NEW_EMPLOYEE);
    }

    const setWindowWidth = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setIsLoading(true);
        async function getUsers() {
            const tokenConfig = isAuthenticated();
            const users = await fetchAllUsers(tokenConfig);
            if (users) setUsers(users);

            setIsLoading(false);
        }

        getUsers();
    }, [])

    useEffect(() => {
        setWidth(window.innerWidth); // Set default width on page load
        window.addEventListener('resize', setWindowWidth);

        return () => window.removeEventListener('resize', setWindowWidth);
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_HOME} className="text-no-u black pointer">
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
                        <div className="mt-6 mb-4 flex flex-center">
                            <button className="btn-x-lg btn-hovered" onClick={handleNewEmployee}>
                                <p className="text-4"><i className="fas fa-plus"></i> New Employee</p>
                            </button>
                        </div>
                        <div>
                            <table id="users-list" className="border-collapse w-100 text-center">
                                <thead>
                                    <tr>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users && users.map((user, i) => (
                                            <tr
                                                key={i}
                                                className="pointer"
                                                onClick={() => handleClickUser(user.u_id)}
                                                style={i % 2 === 0
                                                    ? { backgroundColor: 'rgb(240, 240, 240)' }
                                                    : { backgroundColor: 'rbg(255, 255, 255)' }}
                                            >
                                                <td className="p-3">{width < 380 ? user.acn : user.title}</td>
                                                <td className="p-3">{user.first_name} {user.last_name}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3">{user.phone}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    )
}
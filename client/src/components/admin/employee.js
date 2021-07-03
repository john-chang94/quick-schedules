import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { fetchUser } from '../../services/users';
import axios from 'axios';

export default function AdminEmployee() {
    const { u_id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const user = await fetchUser(u_id);
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
            <div>
                {user && user.first_name}
            </div>
        </div>
    )
}
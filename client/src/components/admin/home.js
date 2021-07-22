import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export default function AdminHome() {
    return (
        <div className="home">
            <Link to={ROUTES.ADMIN_EMPLOYEES} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Employees</h2>
                        <p className="text-10">
                            <i className="fas fa-users"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_SCHEDULES} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Schedules</h2>
                        <p className="text-10">
                            <i className="fas fa-calendar-alt"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_REQUESTS} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Requests</h2>
                        <p className="text-10">
                            <i className="fas fa-inbox"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_STORE} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Store</h2>
                        <p className="text-10">
                            <i className="fas fa-wrench"></i>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}
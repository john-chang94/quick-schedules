import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export default function UserHome() {
    return (
        <div id="home" className="grid2">
            <Link to={ROUTES.USER_SCHEDULES} className="s12 m6 l3 black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Schedules</h2>
                        <p className="text-10">
                            <i className="fas fa-calendar-alt"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_REQUESTS} className="s12 m6 l3 black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Requests</h2>
                        <p className="text-10">
                            <i className="fas fa-inbox"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_AVAILABILITY} className="s12 m6 l3 black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Availability</h2>
                        <p className="text-10">
                            <i className="fas fa-clock"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_PROFILE} className="s12 m6 l3 black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Profile</h2>
                        <p className="text-10">
                            <i className="fas fa-wrench"></i>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}
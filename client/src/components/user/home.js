import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export default function UserHome() {
    return (
        <div id="home" className="grid gap-2 col-xl-4-3fr lg-2-6fr sm-1-12fr">
            <Link to={ROUTES.USER_SCHEDULES} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Schedules</h2>
                        <p className="text-10">
                            <i className="fas fa-calendar-alt"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_REQUESTS} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Requests</h2>
                        <p className="text-10">
                            <i className="fas fa-inbox"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_AVAILABILITY} className="black text-no-u">
                <div className="border-solid-1 border-smooth box-shadow bg-x-light-gray-hovered py-8">
                    <div className="flex flex-col flex-center">
                        <h2>Availability</h2>
                        <p className="text-10">
                            <i className="fas fa-clock"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.USER_PROFILE} className="black text-no-u">
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
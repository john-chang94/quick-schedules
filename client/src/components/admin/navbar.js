import React from 'react';
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

export default function Navbar() {
    return (
        <div className="navbar">
            <Link to={ROUTES.ADMIN_EMPLOYEES} className="s12 m6 l3 black text-no-u">
                <div className="hovered py-2">
                    <div className="flex flex-col flex-center off-white">
                        <h3>Employees</h3>
                        <p className="text-7">
                            <i className="fas fa-users"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_SCHEDULES} className="s12 m6 l3 black text-no-u">
                <div className="hovered py-2">
                    <div className="flex flex-col flex-center off-white">
                        <h3>Schedules</h3>
                        <p className="text-7">
                            <i className="fas fa-calendar-alt"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_REQUESTS} className="s12 m6 l3 black text-no-u">
                <div className="hovered py-2">
                    <div className="flex flex-col flex-center off-white">
                        <h3>Requests</h3>
                        <p className="text-7">
                            <i className="fas fa-inbox"></i>
                        </p>
                    </div>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_STORE} className="s12 m6 l3 black text-no-u">
                <div className="hovered py-2">
                    <div className="flex flex-col flex-center off-white">
                        <h3>Store</h3>
                        <p className="text-7">
                            <i className="fas fa-wrench"></i>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}
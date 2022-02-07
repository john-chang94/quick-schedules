import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { UserContext } from '../../contexts/userContext';

export default function Navbar() {
    const [dropDown, setDropDown] = useState(false);
    const { verifiedUser } = useContext(UserContext);

    // Navbar for large screens
    const renderSideNav = () => (
        <div className="navbar text-center">
            <Link to={ROUTES.ADMIN_EMPLOYEES} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">Employees</p>
                    <p className="text-7">
                        <i className="fas fa-users"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_SCHEDULES} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">Schedules</p>
                    <p className="text-7">
                        <i className="fas fa-calendar-alt"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_REQUESTS} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">Requests</p>
                    <p className="text-7">
                        <i className="fas fa-inbox"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_STORE} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">Store</p>
                    <p className="text-7">
                        <i className="fas fa-wrench"></i>
                    </p>
                </div>
            </Link>
        </div>
    )

    // Navbar for small screens
    const renderDropDown = () => {
        return (
            <div className="dropdown off-white text-7 pointer" onClick={() => setDropDown(!dropDown)}>
                <i className="fas fa-bars"></i>
                {dropDown ? (
                    <div className="navbar-top text-center">
                        <Link to={ROUTES.ADMIN_EMPLOYEES} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">Employees</p>
                            </div>
                        </Link>
                        <Link to={ROUTES.ADMIN_SCHEDULES} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">Schedules</p>
                            </div>
                        </Link>
                        <Link to={ROUTES.ADMIN_REQUESTS} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">Requests</p>
                            </div>
                        </Link>
                        <Link to={ROUTES.ADMIN_STORE} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">Store</p>
                            </div>
                        </Link>
                    </div>
                ) : (
                    null
                )}
            </div>
        )
    }

    useEffect(() => {
        const handleClick = () => setDropDown(!dropDown);

        // Allows user to close dropdown menu when clicking elsewhere
        if (dropDown) {
            window.addEventListener("click", handleClick);
        }

        return () => window.removeEventListener("click", handleClick);
    }, [dropDown])

    if (!verifiedUser) return null;

    return (
        <div>
            {renderDropDown()}
            {renderSideNav()}
        </div>
    )
}
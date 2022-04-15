import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { UserContext } from '../contexts/userContext';

export default function Navbar() {
    const [dropDown, setDropDown] = useState(false);
    const { verifiedUser } = useContext(UserContext);

    // Navbar for large screens
    const renderSideNav = () => (
        <div className="navbar text-center bg-light-blue-darken-4">
            <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_EMPLOYEES : ROUTES.USER_SCHEDULES} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">{verifiedUser.is_admin ? "Employees" : "Schedules"}</p>
                    <p className="text-7">
                        <i className={`fas fa-${verifiedUser.is_admin ? "users" : "calendar-alt"}`}></i>
                    </p>
                </div>
            </Link>
            <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_SCHEDULES : ROUTES.USER_REQUESTS} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">{verifiedUser.is_admin ? "Schedules" : "Requests"}</p>
                    <p className="text-7">
                        <i className={`fas fa-${verifiedUser.is_admin ? "calendar-alt" : "inbox"}`}></i>
                    </p>
                </div>
            </Link>
            <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_REQUESTS : ROUTES.USER_AVAILABILITY} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">{verifiedUser.is_admin ? "Requests" : "Availability"}</p>
                    <p className="text-7">
                        <i className={`fas fa-${verifiedUser.is_admin ? "inbox" : "clock"}`}></i>
                    </p>
                </div>
            </Link>
            <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_STORE : ROUTES.USER_PROFILE} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <p className="text-5">{verifiedUser.is_admin ? "Store" : "Profile"}</p>
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
                    <div className="navbar-top text-center bg-light-blue-darken-4">
                        <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_EMPLOYEES : ROUTES.USER_SCHEDULES} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">{verifiedUser.is_admin ? "Employees" : "Schedules"}</p>
                            </div>
                        </Link>
                        <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_SCHEDULES : ROUTES.USER_REQUESTS} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">{verifiedUser.is_admin ? "Schedules" : "Requests"}</p>
                            </div>
                        </Link>
                        <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_REQUESTS : ROUTES.USER_AVAILABILITY} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">{verifiedUser.is_admin ? "Requests" : "Availability"}</p>
                            </div>
                        </Link>
                        <Link to={verifiedUser.is_admin ? ROUTES.ADMIN_STORE : ROUTES.USER_PROFILE} className="s12 m6 l3 text-no-u">
                            <div className="py-4 hovered off-white">
                                <p className="text-4">{verifiedUser.is_admin ? "Store" : "Profile"}</p>
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
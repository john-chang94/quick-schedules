import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { UserContext } from '../../contexts/userContext';
import { DimensionContext } from '../../contexts/dimensionContext';

export default function Navbar() {
    const [dropDown, setDropDown] = useState(false);
    const { verifiedUser } = useContext(UserContext);
    const { isMobile } = useContext(DimensionContext);

    // Navbar for large screens
    const renderSideNav = () => (
        <div className="navbar text-center">
            <Link to={ROUTES.ADMIN_EMPLOYEES} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <h4>Employees</h4>
                    <p className="text-7">
                        <i className="fas fa-users"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_SCHEDULES} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <h4>Schedules</h4>
                    <p className="text-7">
                        <i className="fas fa-calendar-alt"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_REQUESTS} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <h4>Requests</h4>
                    <p className="text-7">
                        <i className="fas fa-inbox"></i>
                    </p>
                </div>
            </Link>
            <Link to={ROUTES.ADMIN_STORE} className="s12 m6 l3 text-no-u">
                <div className="hovered py-2 off-white">
                    <h4>Store</h4>
                    <p className="text-7">
                        <i className="fas fa-wrench"></i>
                    </p>
                </div>
            </Link>
        </div>
    )

    // Navbar for small screens
    const renderTopNav = () => {
        return dropDown ? (
            <div className="navbar-top px-7 py-1 text-center">
                <Link to={ROUTES.ADMIN_EMPLOYEES} className="s12 m6 l3 text-no-u">
                    <div className="py-4 off-white">
                        <p className="text-6">Employees</p>
                    </div>
                </Link>
                <Link to={ROUTES.ADMIN_SCHEDULES} className="s12 m6 l3 text-no-u">
                    <div className="py-4 off-white">
                        <p className="text-6">Schedules</p>
                    </div>
                </Link>
                <Link to={ROUTES.ADMIN_REQUESTS} className="s12 m6 l3 text-no-u">
                    <div className="py-4 off-white">
                        <p className="text-6">Requests</p>
                    </div>
                </Link>
                <Link to={ROUTES.ADMIN_STORE} className="s12 m6 l3 text-no-u">
                    <div className="py-4 off-white">
                        <p className="text-6">Store</p>
                    </div>
                </Link>
            </div>
        ) : (
            null
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

    return isMobile ? (
        <div className="dropdown off-white text-7 pointer" onClick={() => setDropDown(!dropDown)}>
            <i className="fas fa-bars"></i>
            {renderTopNav()}
        </div>
    ) : (
        renderSideNav()
    )
}
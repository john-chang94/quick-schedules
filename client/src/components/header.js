import { useState, useEffect, useContext } from 'react';
import * as ROUTES from '../constants/routes';
import { UserContext } from '../contexts/userContext';

export default function Header() {
    const { verifiedUser } = useContext(UserContext);

    return (
        <nav>
            <div>
                {verifiedUser && verifiedUser.first_name}
            </div>
        </nav>
    )
}
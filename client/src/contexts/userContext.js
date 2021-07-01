import { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [verifiedUser, setVerifiedUser] = useState({});
    return (
        <UserContext.Provider value={{ verifiedUser, setVerifiedUser }}>
            {children}
        </UserContext.Provider>
    )
}
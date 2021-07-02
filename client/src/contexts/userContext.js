import { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
    const [verifiedUser, setVerifiedUser] = useState(null);
    return (
        <UserContext.Provider value={{ verifiedUser, setVerifiedUser }}>
            {children}
        </UserContext.Provider>
    )
}
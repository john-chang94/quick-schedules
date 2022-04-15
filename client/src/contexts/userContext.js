import { createContext, useState, useEffect, useContext } from "react";
import { isAuthenticated, verifyUser } from "../services/auth";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export default function UserContextProvider({ children }) {
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getVerifiedUser() {
      const tokenConfig = isAuthenticated();
      if (tokenConfig) {
        const verifiedUser = await verifyUser(tokenConfig);
        setVerifiedUser(verifiedUser); // Set verified user in context for header
      }
      setIsLoading(false);
    }

    getVerifiedUser();
  }, []);

  return (
    <UserContext.Provider value={{ verifiedUser, setVerifiedUser }}>
      {!isLoading && children}
    </UserContext.Provider>
  );
}

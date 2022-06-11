import { createContext, useState, useEffect, useContext } from "react";
import { isAuthenticated, verifyUser } from "../services/auth";

export const SchedulesContext = createContext();

export const useUser = () => useContext(SchedulesContext);

export default function SchedulesContextProvider({ children }) {
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
    <SchedulesContext.Provider value={{ verifiedUser, setVerifiedUser }}>
      {!isLoading && children}
    </SchedulesContext.Provider>
  );
}

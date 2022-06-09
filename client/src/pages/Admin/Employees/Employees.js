import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { getUsers } from "../../../services/users";
import * as ROUTES from "../../../constants/routes";
import { Spinner } from "../../../components/Spinner";
import { EmployeeList } from "./EmployeeList";

export default function AdminEmployees() {
  const history = useHistory();
  const [users, setUsers] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);

  const handleClickUser = (u_id) => {
    history.push(`${ROUTES.ADMIN_EMPLOYEES}/${u_id}`);
  };

  const handleAddEmployee = () => {
    history.push(ROUTES.ADMIN_NEW_EMPLOYEE);
  };

  const setWindowWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    let isMounted = true;

    // Listen for window width change
    window.addEventListener("resize", setWindowWidth);

    // Fetch employees
    async function fetchData() {
      const users = await getUsers();
      if (isMounted) setUsers(users);

      setIsLoading(false);
    }

    fetchData();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", setWindowWidth);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <EmployeeList
          users={users}
          width={width}
          handleAddEmployee={handleAddEmployee}
          handleClickUser={handleClickUser}
        />
      )}
    </>
  );
}

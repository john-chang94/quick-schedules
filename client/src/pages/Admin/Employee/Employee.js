import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import * as ROUTES from "../../../constants/routes";

import { isAuthenticated } from "../../../services/auth";
import { getUser, deleteUser } from "../../../services/users";
import { getRoles } from "../../../services/roles";
import { UserContext } from "../../../contexts/userContext";

import { EmployeeInfoGeneral } from "./EmployeeInfoGeneral/EmployeeInfoGeneral";
import { EmployeeInfoSystem } from "./EmployeeInfoSystem/EmployeeInfoSystem";
import { EmployeeEditPassword } from "./EmployeeEditPassword";
import { Spinner } from "../../../components/Spinner";

export default function AdminEmployee() {
  const { u_id } = useParams();
  const history = useHistory();
  const { verifiedUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRemoveUser = async () => {
    const doRemove = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (doRemove) {
      const tokenConfig = isAuthenticated();

      const res = await deleteUser(u_id, tokenConfig);
      if (res.success) {
        history.push("/admin/employees");
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const user = await getUser(u_id);
      const roles = await getRoles();
      if (isMounted) {
        setUser(user);
        setRoles(roles);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [u_id]);

  return (
    <div className="employee-container">
      <div>
        <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-dec black pointer">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-3 w-50 sm-w-100">
          {user && (
            <div>
              <EmployeeInfoGeneral
                user={user}
                verifiedUser={verifiedUser}
                setUser={setUser}
              />
              <hr className="my-4" />
              <EmployeeInfoSystem
                user={user}
                verifiedUser={verifiedUser}
                setUser={setUser}
                roles={roles}
              />
              <hr className="my-4" />
              {verifiedUser && // Render update p/w component only if viewing own account
                verifiedUser.u_id === user.u_id && (
                  <EmployeeEditPassword user={user} />
                )}
            </div>
          )}
          <div className="mt-8 text-center">
            <button
              className="btn-md red btn-hovered pointer-no-dec"
              onClick={handleRemoveUser}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

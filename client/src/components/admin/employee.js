import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { isAuthenticated } from "../../services/auth";
import {
  editPassword,
  editUserGeneral,
  editUserInfo,
  getUser,
  deleteUser,
} from "../../services/users";
import { UserContext } from "../../contexts/userContext";
import { getRoles } from "../../services/roles";
import Loader from "react-loader-spinner";

export default function AdminEmployee() {
  const { u_id } = useParams();
  const history = useHistory();
  const { verifiedUser } = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("auth");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [role_id, setRoleId] = useState("");
  const [hourly_pay, setHourlyPay] = useState("");
  const [started_at, setStartedAt] = useState("");

  const [showEditGeneral, setShowEditGeneral] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);

  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    const body = { password, new_password, confirm_new_password };

    const res = await editPassword(u_id, body, tokenConfig);
    if (res.error) {
      setError(res.error);
      setErrorType("auth");
      setIsUpdating(false);
    } else {
      setError("");
      setSuccess("Password changed successfully");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsUpdating(false);
    }
  };

  const handleUpdateUserGeneral = async () => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    const body = { first_name, last_name, email, phone };

    const res = await editUserGeneral(u_id, body, tokenConfig);

    if (res.error) {
      setError(res.error);
      setErrorType("general");
      setIsUpdating(false);
    } else {
      const user = await getUser(u_id);
      setError("");
      setUser(user);
      setShowEditGeneral(false);
      setIsUpdating(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    const body = {
      role_id,
      hourly_pay,
      started_at,
      updated_at: new Date(Date.now()).toLocaleDateString(),
    };

    const res = await editUserInfo(u_id, body, tokenConfig);

    if (res.error) {
      setError(res.error);
      setErrorType("info");
      setIsUpdating(false);
    } else {
      const user = await getUser(u_id);
      setError("");
      setUser(user);
      setShowEditInfo(false);
      setIsUpdating(false);
    }
  };

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

  const handleShowEditGeneral = () => {
    setError("");
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhone(user.phone);
    setShowEditGeneral(true);
  };

  const handleShowEditInfo = () => {
    setError("");
    setRoleId(user.role_id);
    setHourlyPay(user.hourly_pay);
    setStartedAt(new Date(user.started_at).toISOString().split("T")[0]);
    setShowEditInfo(true);
  }

  const handleCancelEdit = () => {
    setShowEditGeneral(false);
    setShowEditInfo(false);
    setError("");
  };

  const renderUserGeneral = () => (
    <div className="my-2">
      <div className="my-2">
        <h4>Name</h4>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
      <div className="my-2">
        <h4>Email</h4>
        <p>{user.email}</p>
      </div>
      <div className="my-2">
        <h4>Phone</h4>
        <p>{user.phone}</p>
      </div>
      <div className="my-2">
        <button
          className={`btn-med ${
            verifiedUser.level <= user.level && "btn-hovered"
          }`}
          onClick={handleShowEditGeneral}
          disabled={verifiedUser.level > user.level}
        >
          Edit
        </button>
      </div>
    </div>
  );

  const renderUserInfo = () => (
    <div className="my-2">
      <div className="my-2">
        <h4>Role</h4>
        <p>{user.title}</p>
      </div>
      <div className="my-2">
        <h4>Hourly Pay</h4>
        <p>{verifiedUser.level <= user.level ? user.hourly_pay : "**"}</p>
      </div>
      <div className="my-2">
        <h4>Started At</h4>
        <p>{new Date(user.started_at).toLocaleDateString()}</p>
      </div>
      <div className="my-2">
        <h4>Updated At</h4>
        <p>
          {user.updated_at
            ? new Date(user.updated_at).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      <div className="my-2">
        <button
          className={`btn-med ${
            verifiedUser.level <= user.level && "btn-hovered"
          }`}
          onClick={handleShowEditInfo}
          disabled={verifiedUser.level > user.level}
        >
          Edit
        </button>
      </div>
    </div>
  );

  const renderEditGeneral = () => (
    <div className="my-2">
      <div className="my-2">
        <p>First Name</p>
        <input
          type="text"
          className="form-input"
          defaultValue={first_name}
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Last Name</p>
        <input
          type="text"
          className="form-input"
          defaultValue={last_name}
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Email</p>
        <input
          type="text"
          className="form-input"
          defaultValue={email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Phone</p>
        <input
          type="text"
          className="form-input"
          defaultValue={phone}
          onChange={({ target }) => setPhone(target.value)}
        />
      </div>
      <div className="my-3">
        <button
          className="btn-med btn-hovered"
          disabled={isUpdating}
          onClick={() => handleUpdateUserGeneral()}
        >
          Save
        </button>
        <button
          className="btn-med btn-hovered ml-5"
          disabled={isUpdating}
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
      {error && errorType === "general" && <p className="red">{error}</p>}
    </div>
  );

  const renderEditInfo = () => (
    <div className="my-2">
      <div className="my-2">
        <p>Role</p>
        <select
          defaultValue={role_id}
          onChange={({ target }) => setRoleId(parseInt(target.value))}
        >
          {roles &&
            roles.map((role, i) => (
              <option key={i} value={role.role_id}>
                {role.title}
              </option>
            ))}
        </select>
      </div>
      <div className="my-2">
        <p>Hourly Pay</p>
        <input
          type="text"
          className="form-input"
          defaultValue={hourly_pay}
          onChange={({ target }) => setHourlyPay(target.value)}
        />
      </div>
      <div className="my-2">
        <p>Started At</p>
        <input
          type="date"
          className="form-input"
          defaultValue={started_at}
          onChange={({ target }) => setStartedAt(target.value)}
        />
      </div>
      <div className="my-3">
        <button
          className="btn-med btn-hovered"
          disabled={isUpdating}
          onClick={() => handleUpdateUserInfo()}
        >
          Save
        </button>
        <button
          className="btn-med btn-hovered ml-5"
          disabled={isUpdating}
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
      {error && errorType === "info" && <p className="red">{error}</p>}
    </div>
  );

  const renderEditPassword = () => (
    <div>
      <h4 className="mt-2">Update Password</h4>
      <form onSubmit={handleUpdatePassword} className="">
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={password}
            placeholder="Current Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={new_password}
            placeholder="New Password"
            onChange={({ target }) => setNewPassword(target.value)}
          />
        </div>
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={confirm_new_password}
            placeholder="Confirm New Password"
            onChange={({ target }) => setConfirmNewPassword(target.value)}
          />
        </div>
        <div className="my-3">
          <button
            className={`btn-med ${isUpdating ? "" : "btn-hovered"}`}
            disabled={isUpdating}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );

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
        <Link to={ROUTES.ADMIN_EMPLOYEES} className="text-no-u black pointer">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div className="mt-3 w-50 sm-w-100">
          {user && (
            <div>
              {showEditGeneral ? renderEditGeneral() : renderUserGeneral()}
              <hr className="my-4" />
              {showEditInfo ? renderEditInfo() : renderUserInfo()}
              <hr className="my-4" />
              {verifiedUser && // Render update p/w component if viewing own account
                verifiedUser.u_id === user.u_id &&
                renderEditPassword()}

              {error && errorType === "auth" && <p className="red">{error}</p>}
              {success && <p className="green">{success}</p>}
            </div>
          )}
          <div className="mt-8 text-center">
            <button
              className="btn-med red btn-hovered pointer-no-u"
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

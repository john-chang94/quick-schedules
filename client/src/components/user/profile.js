import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { isAuthenticated } from "../../services/auth";
import { getUser, editPassword, editUserGeneral } from "../../services/users";
import Loader from "react-loader-spinner";

export default function UserProfile() {
  const { verifiedUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [u_id, setUid] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");

  const [showEditGeneral, setShowEditGeneral] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    const body = { password, new_password, confirm_new_password };

    const res = await editPassword(u_id, body, tokenConfig);
    if (res.error) {
      setError(res.error);
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
      setIsUpdating(false);
    } else {
      const user = await getUser(u_id, tokenConfig);
      setError("");
      setUser(user);
      setShowEditGeneral(false);
      setIsUpdating(false);
    }
  };

  const handleShowEdit = () => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhone(user.phone);
    setShowEditGeneral(true);
  };

  const handleCancelEdit = () => {
    setShowEditGeneral(false);
    setError("");
  };

  const renderUserGeneral = () => (
    <>
      <div className="py-1">
        <h4>Name</h4>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
      <div className="py-1">
        <h4>Email</h4>
        <p>{user.email}</p>
      </div>
      <div className="py-1">
        <h4>Phone</h4>
        <p>{user.phone}</p>
      </div>
      <div className="py-1">
        <button
          className="btn-md btn-hovered"
          onClick={handleShowEdit}
        >
          Edit
        </button>
      </div>
    </>
  );

  const renderEditGeneral = () => (
    <>
      <div className="py-1">
        <p>First Name</p>
        <input
          type="text"
          className="form-input"
          defaultValue={user.first_name}
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>
      <div className="py-1">
        <p>Last Name</p>
        <input
          type="text"
          className="form-input"
          defaultValue={user.last_name}
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>
      <div className="py-1">
        <p>Email</p>
        <input
          type="text"
          className="form-input"
          defaultValue={user.email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div className="py-1">
        <p>Phone</p>
        <input
          type="text"
          className="form-input"
          defaultValue={user.phone}
          onChange={({ target }) => setPhone(target.value)}
        />
      </div>
      <div className="py-1">
        <button
          className="btn-md btn-hovered"
          disabled={isUpdating}
          onClick={() => handleUpdateUserGeneral()}
        >
          Save
        </button>
        <button
          className="btn-md btn-hovered ml-5"
          disabled={isUpdating}
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
    </>
  );

  const renderEditPassword = () => (
    <>
      <h4>Update Password</h4>
      <form onSubmit={handleUpdatePassword}>
        <div className="py-2">
          <input
            type="password"
            className="form-input"
            value={password}
            placeholder="Current Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div className="py-2">
          <input
            type="password"
            className="form-input"
            value={new_password}
            placeholder="New Password"
            onChange={({ target }) => setNewPassword(target.value)}
          />
        </div>
        <div className="py-2">
          <input
            type="password"
            className="form-input"
            value={confirm_new_password}
            placeholder="Confirm New Password"
            onChange={({ target }) => setConfirmNewPassword(target.value)}
          />
        </div>
        <div className="py-2">
          <button
            className={`btn-md ${isUpdating ? "" : "btn-hovered"}`}
            disabled={isUpdating}
          >
            Update
          </button>
        </div>
      </form>
    </>
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const user = await getUser(verifiedUser.u_id);

      if (isMounted) {
        setUid(user.u_id);
        setUser(user);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [verifiedUser]);

  return (
    <div className="profile-container">
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div className="w-50 sm-w-100">
          {user && (
            <div>
              {showEditGeneral ? renderEditGeneral() : renderUserGeneral()}
              <hr className="my-4" />
              {renderEditPassword()}

              {error ? <p className="red">{error}</p> : null}
              {success ? <p className="green">{success}</p> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

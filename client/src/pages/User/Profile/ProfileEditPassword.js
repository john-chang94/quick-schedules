import React, { useState } from "react";
import { isAuthenticated } from "../../../services/auth";
import { editPassword } from "../../../services/users";

export const ProfileEditPassword = ({
  state: { u_id, isUpdating },
  dispatch,
}) => {
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_new_password, setConfirmNewPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_IS_UPDATING" });
    const tokenConfig = isAuthenticated();

    const body = { password, new_password, confirm_new_password };
    const res = await editPassword(u_id, body, tokenConfig);
    if (res.error) {
      dispatch({
        type: "SET_ANY",
        payload: {
          error: res.error,
          isUpdating: false,
        },
      });
    } else {
      setSuccess("Password changed successfully");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      dispatch({
        type: "SET_ANY",
        payload: {
          error: "",
          isUpdating: false,
        },
      });
    }
  };

  return (
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
      {success ? <p className="green">{success}</p> : null}
    </>
  );
};

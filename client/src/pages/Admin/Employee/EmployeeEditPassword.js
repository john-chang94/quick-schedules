import React, { useReducer } from "react";
import { isAuthenticated } from "../../../services/auth";
import { editPassword } from "../../../services/users";

export const EmployeeEditPassword = ({ user }) => {
  const initialState = {
    password: "",
    new_password: "",
    confirm_new_password: "",
    error: "",
    success: "",
    isUpdating: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_VALUE":
        return { ...state, [action.field]: action.value };
      case "TOGGLE_IS_UPDATING":
        return { ...state, isUpdating: !state.isUpdating };
      case "UPDATE_ERROR":
        return {
          ...state,
          error: action.payload.error,
          isUpdating: !state.isUpdating,
        };
      case "UPDATE_SUCCESS":
        return {
          ...state,
          error: "",
          success: "Password changed successfully",
          password: "",
          new_password: "",
          confirm_new_password: "",
          isUpdating: !state.isUpdating,
        };
      case "RESET":
        return initialState;
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { password, new_password, confirm_new_password } = state;
    dispatch({ type: "TOGGLE_IS_UPDATING" });
    const tokenConfig = isAuthenticated();

    const body = { password, new_password, confirm_new_password };
    const res = await editPassword(user.u_id, body, tokenConfig);

    if (res.error) {
      dispatch({ type: "UPDATE_ERROR", payload: { error: res.error } });
    } else {
      dispatch({ type: "UPDATE_SUCCESS" });
    }
  };

  return (
    <div>
      <h4 className="mt-2">Update Password</h4>
      <form onSubmit={handleUpdatePassword} className="">
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={state.password}
            placeholder="Current Password"
            onChange={({ target }) =>
              dispatch({
                type: "SET_VALUE",
                field: "password",
                value: target.value,
              })
            }
          />
        </div>
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={state.new_password}
            placeholder="New Password"
            onChange={({ target }) =>
              dispatch({
                type: "SET_VALUE",
                field: "new_password",
                value: target.value,
              })
            }
          />
        </div>
        <div className="my-2">
          <input
            type="password"
            className="form-input"
            value={state.confirm_new_password}
            placeholder="Confirm New Password"
            onChange={({ target }) =>
              dispatch({
                type: "SET_VALUE",
                field: "confirm_new_password",
                value: target.value,
              })
            }
          />
        </div>
        <div className="my-3">
          <button
            className={`btn-md ${state.isUpdating ? "" : "btn-hovered"}`}
            disabled={state.isUpdating}
          >
            Update
          </button>
        </div>
      </form>
      {state.error && <p className="red">{state.error}</p>}
      {state.success && <p className="green">{state.success}</p>}
    </div>
  );
};

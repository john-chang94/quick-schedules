import React, { useReducer } from "react";
import { InfoSystem } from "./InfoSystem";
import { EditInfoSystem } from "./EditInfoSystem";
import { editUserSystem, getUser } from "../../../../services/users";
import { isAuthenticated } from "../../../../services/auth";

export const EmployeeInfoSystem = ({ user, verifiedUser, roles, setUser }) => {
  const initialState = {
    role_id: "",
    hourly_pay: "",
    started_at: "",
    showEdit: false,
    isUpdating: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_VALUE":
        return { ...state, [action.field]: action.value };
      case "SHOW_EDIT":
        return {
          role_id: user.role_id,
          hourly_pay: user.hourly_pay,
          // datepicker only accepts yyyy-mm-dd
          started_at: new Date(user.started_at).toISOString().split("T")[0],
          error: "",
          showEdit: true,
        };
      case "HIDE_EDIT":
        return { ...state, error: "", showEdit: false };
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
          showEdit: false,
          isUpdating: !state.isUpdating,
        };
      case "RESET":
        return initialState;
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleUpdateUserSystem = async () => {
    const { role_id, hourly_pay, started_at } = state;
    const tokenConfig = isAuthenticated();
    dispatch({ type: "TOGGLE_IS_UPDATING" });

    let pay;
    if (hourly_pay.indexOf("$") !== -1) {
      // Remove $ for float data validation
      pay = hourly_pay.slice(1);
    } else {
      pay = hourly_pay;
    }

    const body = {
      role_id,
      hourly_pay: pay,
      started_at,
      updated_at: new Date(Date.now()).toLocaleDateString(),
    };
    const res = await editUserSystem(user.u_id, body, tokenConfig);

    if (res.error) {
      dispatch({ type: "UPDATE_ERROR", payload: { error: res.error } });
    } else {
      const updatedUser = await getUser(user.u_id);
      setUser(updatedUser);
      dispatch({ type: "UPDATE_SUCCESS" });
    }
  };

  return (
    <>
      {state.showEdit ? (
        <EditInfoSystem
          state={state}
          dispatch={dispatch}
          roles={roles}
          handleUpdateUserSystem={handleUpdateUserSystem}
        />
      ) : (
        <InfoSystem
          user={user}
          verifiedUser={verifiedUser}
          dispatch={dispatch}
        />
      )}
      {state.error && <p className="red">{state.error}</p>}
    </>
  );
};

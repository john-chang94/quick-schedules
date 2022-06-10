import React, { useReducer } from "react";
import { InfoGeneral } from "./InfoGeneral";
import { EditInfoGeneral } from "./EditInfoGeneral";
import { editUserGeneral, getUser } from "../../../../services/users";
import { isAuthenticated } from "../../../../services/auth";

export const EmployeeInfoGeneral = ({ user, verifiedUser, setUser }) => {
  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    error: "",
    showEdit: false,
    isUpdating: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_VALUE":
        return { ...state, [action.field]: action.value };
      case "SHOW_EDIT":
        return {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
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

  const handleUpdateUserGeneral = async () => {
    const { first_name, last_name, email, phone } = state;
    const tokenConfig = isAuthenticated();
    dispatch({ type: "TOGGLE_IS_UPDATING" });

    const body = { first_name, last_name, email, phone };
    const res = await editUserGeneral(user.u_id, body, tokenConfig);

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
        <EditInfoGeneral
          state={state}
          dispatch={dispatch}
          handleUpdateUserGeneral={handleUpdateUserGeneral}
        />
      ) : (
        <InfoGeneral
          user={user}
          verifiedUser={verifiedUser}
          dispatch={dispatch}
        />
      )}
      {state.error && <p className="red">{state.error}</p>}
    </>
  );
};

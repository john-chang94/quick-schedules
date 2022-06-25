import { useEffect, useContext, useReducer } from "react";
import { UserContext } from "../../../contexts/userContext";
import { getUser } from "../../../services/users";

import { Spinner } from "../../../components/Spinner";
import { ProfileInfoGeneral } from "./ProfileInfoGeneral";
import { ProfileEditGeneral } from "./ProfileEditGeneral";
import { ProfileEditPassword } from "./ProfileEditPassword";

export default function UserProfile() {
  const { verifiedUser } = useContext(UserContext);

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_VALUE":
        return { ...state, [action.payload.field]: action.payload.value };
      case "SET_ANY":
        return { ...state, ...action.payload };
      case "SHOW_EDIT":
        return {
          ...state,
          first_name: state.user.first_name,
          last_name: state.user.last_name,
          email: state.user.email,
          phone: state.user.phone,
          showEditGeneral: true,
        };
      case "HIDE_EDIT":
        return {
          ...state,
          error: "",
          showEditGeneral: false,
        };
      case "TOGGLE_IS_UPDATING":
        return { ...state, isUpdating: !state.isUpdating };
      default:
        return initialState;
    }
  };

  const initialState = {
    isLoading: true,
    showEditGeneral: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const user = await getUser(verifiedUser.u_id);

      if (isMounted) {
        dispatch({
          type: "SET_ANY",
          payload: {
            user,
            u_id: user.u_id,
            isLoading: false,
          },
        });
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [verifiedUser]);

  if (state.isLoading) return <Spinner />;

  return (
    <div className="profile-container">
      <div className="w-50 sm-w-100">
        {state.showEditGeneral ? (
          <ProfileEditGeneral state={state} dispatch={dispatch} />
        ) : (
          <ProfileInfoGeneral user={state.user} dispatch={dispatch} />
        )}
        <hr className="my-4" />
        <ProfileEditPassword state={state} dispatch={dispatch} />

        {state.error ? <p className="red">{state.error}</p> : null}
      </div>
    </div>
  );
}

import React from "react";
import { isAuthenticated } from "../../../services/auth";
import { editUserGeneral, getUser } from "../../../services/users";

export const ProfileEditGeneral = ({
  state: { user, isUpdating, first_name, last_name, email, phone },
  dispatch,
}) => {

  const handleUpdateUserGeneral = async () => {
    dispatch({ type: "TOGGLE_IS_UPDATING" });
    const tokenConfig = isAuthenticated();

    const body = { first_name, last_name, email, phone };
    const res = await editUserGeneral(user.u_id, body, tokenConfig);
    if (res.error) {
      dispatch({
        type: "SET_ANY",
        payload: {
          error: res.error,
          isUpdating: false,
        },
      });
    } else {
      const updatedUser = await getUser(user.u_id, tokenConfig);
      dispatch({
        type: "SET_ANY",
        payload: {
          error: "",
          user: updatedUser,
          showEditGeneral: false,
          isUpdating: false,
        },
      });
    }
  };

  return (
    <>
      <div className="py-1">
        <p>First Name</p>
        <input
          type="text"
          className="form-input"
          value={first_name}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              payload: {
                field: "first_name",
                value: target.value,
              },
            })
          }
        />
      </div>
      <div className="py-1">
        <p>Last Name</p>
        <input
          type="text"
          className="form-input"
          value={last_name}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              payload: {
                field: "last_name",
                value: target.value,
              },
            })
          }
        />
      </div>
      <div className="py-1">
        <p>Email</p>
        <input
          type="text"
          className="form-input"
          value={email}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              payload: {
                field: "email",
                value: target.value,
              },
            })
          }
        />
      </div>
      <div className="py-1">
        <p>Phone</p>
        <input
          type="text"
          className="form-input"
          value={phone}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              payload: {
                field: "phone",
                value: target.value,
              },
            })
          }
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
          onClick={() => dispatch({ type: "HIDE_EDIT" })}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

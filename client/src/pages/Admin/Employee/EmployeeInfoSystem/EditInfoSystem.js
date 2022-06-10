import React from "react";

export const EditInfoSystem = ({
  state,
  dispatch,
  roles,
  handleUpdateUserSystem,
}) => {
  return (
    <div className="my-2">
      <div className="my-2">
        <p>Role</p>
        <select
          value={state.role_id}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              field: "role_id",
              value: target.value,
            })
          }
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
          value={state.hourly_pay}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              field: "hourly_pay",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-2">
        <p>Started At</p>
        <input
          type="date"
          className="form-input"
          value={state.started_at}
          onChange={({ target }) =>
            dispatch({
              type: "SET_VALUE",
              field: "started_at",
              value: target.value,
            })
          }
        />
      </div>
      <div className="my-3">
        <button
          className="btn-md btn-hovered"
          disabled={state.isUpdating}
          onClick={handleUpdateUserSystem}
        >
          Save
        </button>
        <button
          className="btn-md btn-hovered ml-5"
          disabled={state.isUpdating}
          onClick={() => dispatch({ type: "HIDE_EDIT" })}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

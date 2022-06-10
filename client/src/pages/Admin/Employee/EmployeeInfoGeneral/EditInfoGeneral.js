import React from "react";

export const EditInfoGeneral = ({ state, dispatch, handleUpdateUserGeneral }) => {
    return (
        <div className="my-2">
          <div className="my-2">
            <p>First Name</p>
            <input
              type="text"
              className="form-input"
              value={state.first_name}
              onChange={({ target }) => dispatch({
                type: "SET_VALUE",
                field: "first_name",
                value: target.value
              })}
            />
          </div>
          <div className="my-2">
            <p>Last Name</p>
            <input
              type="text"
              className="form-input"
              value={state.last_name}
              onChange={({ target }) => dispatch({
                type: "SET_VALUE",
                field: "last_name",
                value: target.value
              })}
            />
          </div>
          <div className="my-2">
            <p>Email</p>
            <input
              type="text"
              className="form-input"
              value={state.email}
              onChange={({ target }) => dispatch({
                type: "SET_VALUE",
                field: "email",
                value: target.value
              })}
            />
          </div>
          <div className="my-2">
            <p>Phone</p>
            <input
              type="text"
              className="form-input"
              value={state.phone}
              onChange={({ target }) => dispatch({
                type: "SET_VALUE",
                field: "phone",
                value: target.value
              })}
            />
          </div>
          <div className="my-3">
            <button
              className="btn-md btn-hovered"
              disabled={state.isUpdating}
              onClick={handleUpdateUserGeneral}
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
          {state.error && state.errorType === "general" && <p className="red">{state.error}</p>}
        </div>
    )
}
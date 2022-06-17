import React from "react";

export const ProfileInfoGeneral = ({ user, dispatch }) => {
  return (
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
          onClick={() => dispatch({ type: "SHOW_EDIT" })}
        >
          Edit
        </button>
      </div>
    </>
  );
};

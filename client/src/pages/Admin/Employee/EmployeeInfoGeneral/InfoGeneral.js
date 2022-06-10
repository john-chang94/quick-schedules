import React from "react";

export const InfoGeneral = ({ user, verifiedUser, dispatch }) => {
  return (
    <div className="my-2">
      <div className="my-2">
        <h4>Name</h4>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
      <div className="my-2">
        <h4>Email</h4>
        <p>{user.email}</p>
      </div>
      <div className="my-2">
        <h4>Phone</h4>
        <p>{user.phone}</p>
      </div>
      <div className="my-2">
        <button
          className={`btn-md ${
            verifiedUser.level <= user.level && "btn-hovered"
          }`}
          onClick={() => dispatch({ type: "SHOW_EDIT" })}
          disabled={verifiedUser.level > user.level}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

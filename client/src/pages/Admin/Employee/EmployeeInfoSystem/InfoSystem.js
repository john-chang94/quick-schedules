import React from "react";

export const InfoSystem = ({ user, verifiedUser, dispatch }) => {
  return (
    <div className="my-2">
      <div className="my-2">
        <h4>Role</h4>
        <p>{user.title}</p>
      </div>
      <div className="my-2">
        <h4>Hourly Pay</h4>
        <p>{verifiedUser.level <= user.level ? user.hourly_pay : "**"}</p>
      </div>
      <div className="my-2">
        <h4>Started At</h4>
        <p>{new Date(user.started_at).toLocaleDateString()}</p>
      </div>
      <div className="my-2">
        <h4>Updated At</h4>
        <p>
          {user.updated_at
            ? new Date(user.updated_at).toLocaleDateString()
            : "N/A"}
        </p>
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

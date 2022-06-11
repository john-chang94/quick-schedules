import React from "react";

export const ShiftMobile = ({ user, handleShowEditShift, shiftIndex }) => {
  const getTime = (shift) => {
    return new Date(shift).toLocaleTimeString().replace(":00 ", " ");
  };

  return (
    <div className="p-1" onClick={() => handleShowEditShift(user, shiftIndex)}>
      <p>
        {getTime(user.shift_start)} -&nbsp;
        {getTime(user.shift_end)}
      </p>
      <p>
        <strong>
          {user.first_name} {user.last_name}
        </strong>
      </p>
      <p>
        <em>{user.title}</em>
      </p>
    </div>
  );
};

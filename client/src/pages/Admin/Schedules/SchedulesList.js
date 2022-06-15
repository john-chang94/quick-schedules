import React from "react";
import { useSchedules } from "./SchedulesContext";

import { EditShift } from "./EditShift";
import { Spinner } from "../../../components/Spinner";

export const SchedulesList = () => {
  const {
    state: { isLoadingSchedule, users, days, userId, availabilityIndex },
    dispatch,
  } = useSchedules();

  // Render edit shift (new)
  const handleClickShiftNew = (u_id, a_i) => {
    dispatch({
      type: "ON_CLICK_SHIFT_NEW",
      payload: { userId: u_id, availabilityIndex: a_i },
    });
  };

  // Render edit shift (update)
  const handleClickShiftEdit = (u_id, a_i, shiftStartValue, shiftEndValue) => {
    dispatch({
      type: "ON_CLICK_SHIFT_EDIT",
      payload: {
        userId: u_id,
        availabilityIndex: a_i,
        shift_start_value: shiftStartValue,
        shift_end_value: shiftEndValue,
      },
    });
  };

  const getTimeValue = (shift) => {
    const date = new Date(shift);
    const hour = date.getHours();
    const min = date.getMinutes();
    const values = `${hour.toString()} ${min.toString()}`;
    return values;
  };

  const getTime = (shift) => {
    return new Date(shift).toLocaleTimeString().replace(":00 ", " ");
  };

  const renderBlank = (u_id, a_i, time) => (
    <td
      key={a_i}
      // Keep bg color black if employee is 'N/A' for availability
      className={`pointer ${
        time.start_time === "N/A" ? "bg-black" : "hovered"
      }`}
      onClick={() => handleClickShiftNew(u_id, a_i)}
    ></td>
  );

  const renderShift = (u_id, a_i, shift_start, shift_end) => (
    <td
      key={a_i}
      className="pointer schedules-text bg-blue-lighten-4"
      onClick={() =>
        handleClickShiftEdit(
          u_id,
          a_i,
          getTimeValue(shift_start),
          getTimeValue(shift_end)
        )
      }
    >
      {getTime(shift_start)} -&nbsp;
      {getTime(shift_end)}
    </td>
  );

  return isLoadingSchedule ? (
    <Spinner />
  ) : (
    <table className="schedules-table w-100 border-collapse text-center table-fixed schedules-text">
      <thead>
        <tr>
          <th className="bg-x-light-gray">Name</th>
          {days &&
            days.map((day, i) => (
              <th key={i} className="bg-x-light-gray">
                <p>{new Date(day).toString().split(" ")[0]}</p>
                <p style={{ fontWeight: "normal" }}>
                  <em>{new Date(day).toLocaleDateString()}</em>
                </p>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user, u_i) => (
            <tr key={u_i}>
              <td className="py-1">
                <p>
                  <strong>
                    {user.first_name} {user.last_name}
                  </strong>
                </p>
                <em>{user.level === 2 ? "A. Manager" : user.title}</em>
              </td>
              {user.availability.map((time, a_i) =>
                // Only render edit mode for the selected date and employee
                userId === user.u_id && availabilityIndex === a_i ? (
                  //   ? renderEditShift(user.u_id, a_i, user.shifts[a_i])
                  <EditShift
                    shift={user.shifts[a_i]}
                    u_id={user.u_id}
                    a_i={a_i}
                    key={a_i}
                  />
                ) : // Render shifts if they exist during the selected week
                user.shifts[a_i].shift_end === null ? (
                  renderBlank(user.u_id, a_i, time)
                ) : (
                  renderShift(
                    user.u_id,
                    a_i,
                    user.shifts[a_i].shift_start,
                    user.shifts[a_i].shift_end
                  )
                )
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

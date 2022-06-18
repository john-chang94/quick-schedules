import React from "react";
import { useSchedules } from "../../Admin/Schedules/SchedulesContext";

export const SchedulesList = () => {
  const {
    state: { days, users },
  } = useSchedules();

  const getTime = (shift) => {
    return new Date(shift).toLocaleTimeString().replace(":00 ", " ");
  };

  const renderBlank = (a_i, time) => (
    <td
      key={a_i}
      // Keep bg color black if employee is 'N/A' for availability
      className={`${time.start_time === "N/A" && "bg-black"}`}
    ></td>
  );

  const renderShift = (a_i, shift_start, shift_end) => (
    <td key={a_i} className="bg-blue-lighten-4">
      {getTime(shift_start)} -&nbsp;
      {getTime(shift_end)}
    </td>
  );

  return (
    <table className="schedules-table w-100 mt-1 border-collapse text-center table-fixed schedules-text">
      <tbody>
        <tr>
          <td className="bg-grey-lighten-3">
            <strong>Name</strong>
          </td>
          {days &&
            days.map((day, i) => (
              <td key={i} className="bg-grey-lighten-3">
                <strong>{new Date(day).toString().split(" ")[0]}</strong>
                <p>
                  <em>{new Date(day).toLocaleDateString()}</em>
                </p>
              </td>
            ))}
        </tr>
        {users &&
          users.map((user, u_i) => (
            <tr key={u_i}>
              <td className="py-1">
                <p>
                  <strong>
                    {user.first_name} {user.last_name}
                  </strong>
                </p>
                <em>{user.title}</em>
              </td>
              {user.availability.map((time, a_i) =>
                user.shifts[a_i].shift_end === null
                  ? renderBlank(a_i, time)
                  : renderShift(
                      a_i,
                      user.shifts[a_i].shift_start,
                      user.shifts[a_i].shift_end
                    )
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

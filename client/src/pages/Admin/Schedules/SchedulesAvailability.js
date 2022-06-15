import React from "react";
import { useSchedules } from "./SchedulesContext";

export const SchedulesAvailability = () => {
  const { state: { days, availabilities } } = useSchedules();
  return (
    <div className="availability">
      <h3 className="text-center">Availability</h3>
      <table className="border-collapse w-100 text-center schedules-text">
        <thead>
          <tr>
            <th>Name</th>
            {
              // Render the day only
              days &&
                days.map((day, i) => (
                  <th key={i}>
                    <p>{new Date(day).toString().split(" ")[0]}</p>
                  </th>
                ))
            }
          </tr>
        </thead>
        <tbody>
          {availabilities &&
            availabilities.map((user, i) => (
              <tr
                key={i}
                style={
                  i % 2 === 0
                    ? { backgroundColor: "rgb(235, 235, 235)" }
                    : { backgroundColor: "rbg(255, 255, 255)" }
                }
              >
                <td>
                  <p>
                    <strong>
                      {user.first_name} {user.last_name}
                    </strong>
                  </p>
                  <em>{user.level === 2 ? "A. Manager" : user.title}</em>
                </td>
                {user.availability.map((time, i) => (
                  <td
                    key={i}
                    className={`${time.start_time === "N/A" && "bg-black"}`}
                  >
                    {time.start_time === "ANY" && time.end_time === "ANY"
                      ? "ANY"
                      : `${time.start_time} - ${time.end_time}`}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

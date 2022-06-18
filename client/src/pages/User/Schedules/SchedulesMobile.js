import React from "react";
import { format } from "date-fns";
import { useSchedules } from "../../Admin/Schedules/SchedulesContext";

export const SchedulesMobile = () => {
  const {
    state: { usersMobile },
  } = useSchedules();

  return (
    <div className="schedules-mobile">
      {usersMobile.length > 0 &&
        usersMobile.map((user, i) => (
          <div key={i} className="flex">
            {user.label ? (
              <div className="w-100 border-x bg-grey-lighten-3 text-center">
                <p>
                  <strong>{format(new Date(user.shift_start), "PP")}</strong>
                </p>
              </div>
            ) : (
              <>
                <div
                  className="flex flex-col flex-center border-solid-1 p-1"
                  style={{ width: "20%" }}
                >
                  <p>
                    <strong>
                      {new Date(user.shift_start).toDateString().split(" ")[0]}
                    </strong>
                  </p>
                  <p>
                    <strong>
                      {new Date(user.shift_start).toDateString().split(" ")[2]}
                    </strong>
                  </p>
                </div>
                <div className="w-80 border-solid-1 p-1">
                  <p>
                    {new Date(user.shift_start)
                      .toLocaleTimeString()
                      .replace(":00 ", " ")}{" "}
                    -{" "}
                    {new Date(user.shift_end)
                      .toLocaleTimeString()
                      .replace(":00 ", " ")}
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
              </>
            )}
          </div>
        ))}
    </div>
  );
};

import React, { useState } from "react";
import { format } from "date-fns";
import { useSchedules } from "../SchedulesContext";

import { EditShiftMobile } from "./EditShiftMobile";
import { ShiftMobile } from "./ShiftMobile";

export const SchedulesListMobile = () => {
  const [dayIndex, setDayIndex] = useState(null); // For saving a shift
  const [editShiftIndex, setEditShiftIndex] = useState(null);

  const {
    state: { usersMobile, days },
    dispatch,
  } = useSchedules();

  const getTimeValue = (shift) => {
    const date = new Date(shift);
    const hour = date.getHours();
    const min = date.getMinutes();
    const values = `${hour.toString()} ${min.toString()}`;
    return values;
  };

  const handleShowEditShift = (user, shiftIndex) => {
    // Set specific shift time values to match with times array in the select inputs
    dispatch({
      type: "SET_ANY",
      payload: {
        shift_start_value: getTimeValue(user.shift_start),
        shift_end_value: getTimeValue(user.shift_end),
      },
    });
    // Enable edit shift component to render
    setEditShiftIndex(shiftIndex);
    // Get date to be saved when submitting
    for (let i = 0; i < days.length; i++) {
      // Use format for mobile, otherwise shifts will return one day after (ㆆ_ㆆ)
      if (
        format(new Date(user.shift_start), "yyyy-MM-dd") ===
        days[i].split("T")[0]
      ) {
        setDayIndex(i);
      }
    }
  };

  const getDay = (shift) => {
    return new Date(shift).toDateString().split(" ")[0];
  };

  const getDate = (shift) => {
    return new Date(shift).toDateString().split(" ")[2];
  };

  return (
    usersMobile.length > 0 &&
    usersMobile.map((user, i) => (
      <div key={i}>
        {user.label ? ( // Render date labels for mobile schedule
          <div className="w-100 border-x bg-x-light-gray text-center">
            <p>
              <strong>{format(new Date(user.shift_start), "PP")}</strong>
            </p>
          </div>
        ) : (
          <div className="flex">
            <div
              className="flex flex-col flex-center border-solid-1 p-1"
              style={{ width: "20%" }}
            >
              <p>
                <strong>{getDay(user.shift_start)}</strong>
              </p>
              <p>
                <strong>{getDate(user.shift_start)}</strong>
              </p>
            </div>
            <div className="w-80 border-solid-1">
              {editShiftIndex === i ? (
                <EditShiftMobile
                  user={user}
                  dayIndex={dayIndex}
                  setEditShiftIndex={setEditShiftIndex}
                />
              ) : (
                <ShiftMobile
                  user={user}
                  shiftIndex={i}
                  handleShowEditShift={handleShowEditShift}
                />
              )}
            </div>
          </div>
        )}
      </div>
    ))
  );
};

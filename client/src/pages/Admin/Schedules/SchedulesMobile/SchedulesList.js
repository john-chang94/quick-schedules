import React, { useState } from "react";
import { format } from "date-fns";
import { EditShiftMobile } from "./EditShiftMobile";
import { ShiftMobile } from "./ShiftMobile";

export const SchedulesList = ({
  usersMobile,
  days,
  presets,
  times,
  store,
  getTimeValue,
  handleFetchSchedule,
}) => {
  const [shiftStartValue, setShiftStartValue] = useState("");
  const [shiftEndValue, setShiftEndValue] = useState("");
  const [dayIndex, setDayIndex] = useState(null); // For saving a shift
  const [editShiftIndex, setEditShiftIndex] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [error, setError] = useState("");
  const [u_id, setUId] = useState(null);
  const [date, setDate] = useState("");

  const handleShowEditShift = (user, shiftIndex) => {
    // Set specific shift time values to match with times array in the select inputs
    setShiftStartValue(getTimeValue(user.shift_start));
    setShiftEndValue(getTimeValue(user.shift_end));
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

  const handleSelectPreset = (shiftValue) => {
    // Cancel if user clicks on default value 'select'
    if (!shiftValue) return;
    setShiftStartValue(shiftValue.split("-")[0]);
    setShiftEndValue(shiftValue.split("-")[1]);
  };

  const handleShowAddShift = () => {
    setShiftStartValue(store.store_open_value);
    setShiftEndValue(store.store_close_value);
    setShowAddShift(true);
  }

  const handleCancelAddShift = () => {
    setShiftStartValue("");
    setShiftEndValue("");
    setUId("");
    setError("");
    setShowAddShift(false);
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
                // ? renderEditShift(user)
                <EditShiftMobile
                  dayIndex={dayIndex}
                  user={user}
                  presets={presets}
                  days={days}
                  times={times}
                  store={store}
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  handleSelectPreset={handleSelectPreset}
                  shiftStartValue={shiftStartValue}
                  shiftEndValue={shiftEndValue}
                  setShiftStartValue={setShiftStartValue}
                  setShiftEndValue={setShiftEndValue}
                  setEditShiftIndex={setEditShiftIndex}
                  handleFetchSchedule={handleFetchSchedule}
                />
              ) : (
                // : renderShift(user, i)}
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

import React from "react";
import { toDate } from "date-fns";

import { isAuthenticated } from "../../../../services/auth";
import { deleteShift, updateShift } from "../../../../services/shifts";

import { Spinner } from "../../../../components/Spinner";

export const EditShiftMobile = ({
  user,
  presets,
  days,
  times,
  store,
  dayIndex,
  isUpdating,
  setIsUpdating,
  handleSelectPreset,
  shiftStartValue,
  shiftEndValue,
  setShiftStartValue,
  setShiftEndValue,
  setEditShiftIndex,
  handleFetchSchedule
}) => {

  const handleSaveShift = async (u_id, s_id) => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    // Get shift date
    const date = toDate(new Date(days[dayIndex]));

    // Get hour and minute in INT data type for date object
    const startTimeHour = parseInt(shiftStartValue.split(" ")[0]);
    const startTimeMinute = parseInt(shiftStartValue.split(" ")[1]);
    // Get hour and minute in INT data type for date object
    const endTimeHour = parseInt(shiftEndValue.split(" ")[0]);
    const endTimeMinute = parseInt(shiftEndValue.split(" ")[1]);
    // Create new date objects with year, month, day, hour, minute
    const shift_start = toDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        startTimeHour,
        startTimeMinute
      )
    ).toLocaleString();

    const shift_end = toDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        endTimeHour,
        endTimeMinute
      )
    ).toLocaleString();
    const body = { u_id, shift_start, shift_end };
    await updateShift(s_id, body, tokenConfig);

    await handleFetchSchedule();

    setEditShiftIndex(null);
    setIsUpdating(false);
  };

  const handleRemoveShift = async (s_id) => {
    const toDelete = window.confirm(
      "Are you sure you want to remove this shift?"
    );
    if (toDelete) {
      const tokenConfig = isAuthenticated();
      setIsUpdating(true);
      await deleteShift(s_id, tokenConfig);

      await handleFetchSchedule();
      setEditShiftIndex(null);
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-blue-grey-lighten-5 p-1">
      <div className="flex justify-evenly">
        <div className="flex flex-col flex-center text-center">
          <p className="schedules-mobile-text">
            <strong>
              {user.first_name} {user.last_name}
            </strong>
          </p>
          <p className="schedules-mobile-text">
            <em>{user.title}</em>
          </p>
        </div>
        <div>
          <div className="flex justify-evenly mb-1">
            <p className="mr-1 schedules-mobile-text">Preset</p>
            <select
              defaultValue="0 0"
              disabled={isUpdating}
              onChange={({ target }) => handleSelectPreset(target.value)}
            >
              <option value="">Select</option>
              {presets &&
                presets.map((preset, i) => (
                  <option
                    key={i}
                    value={`${preset.shift_start_value}-${preset.shift_end_value}`}
                  >
                    {preset.shift_start} - {preset.shift_end}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-evenly mb-1">
            <p className="mr-1 schedules-mobile-text">Start</p>
            <select
              value={shiftStartValue}
              disabled={isUpdating}
              onChange={({ target }) => setShiftStartValue(target.value)}
            >
              {times &&
                times.map((time, i) => (
                  <option
                    key={i}
                    value={time.value}
                    disabled={
                      time.level < parseFloat(store.store_open_level) ||
                      time.level > parseFloat(store.store_close_level)
                    }
                  >
                    {time.time}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-evenly mb-1">
            <p className="mr-1 schedules-mobile-text">End</p>
            <select
              value={shiftEndValue}
              disabled={isUpdating}
              onChange={({ target }) => setShiftEndValue(target.value)}
            >
              {times &&
                times.map((time, i) => (
                  <option
                    key={i}
                    value={time.value}
                    disabled={
                      time.level < parseFloat(store.store_open_level) ||
                      time.level > parseFloat(store.store_close_level)
                    }
                  >
                    {time.time}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {isUpdating ? (
        <Spinner type={"ThreeDots"} height={12} marginTop={0} />
      ) : (
        <div className="w-100 flex justify-evenly">
          <div
            className="py-1 w-100 text-center pointer hovered border-solid-1 bg-white"
            onClick={() => handleSaveShift(user.u_id, user.s_id)}
          >
            <i className="fas fa-check" />
          </div>
          <div
            className="py-1 w-100 text-center pointer hovered border-solid-1 bg-white"
            onClick={() => handleRemoveShift(user.s_id)}
          >
            <i className="fas fa-trash-alt" />
          </div>
          <div
            className="py-1 w-100 text-center pointer hovered border-solid-1 bg-white"
            onClick={() => setEditShiftIndex(null)}
          >
            <i className="fas fa-times" />
          </div>
        </div>
      )}
    </div>
  );
};

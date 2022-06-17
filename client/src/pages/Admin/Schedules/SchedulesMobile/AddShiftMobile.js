import React, { useState, useRef } from "react";
import { toDate, parseISO } from "date-fns";
import { CSSTransition } from "react-transition-group";

import { useSchedules } from "../SchedulesContext";
import { isAuthenticated } from "../../../../services/auth";
import { createShift } from "../../../../services/shifts";

export const AddShiftMobile = () => {
  const [u_id, setUId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    state: {
      users,
      presets,
      times,
      store,
      shift_start_value,
      shift_end_value,
      showAddShift,
    },
    dispatch,
    handleFetchSchedule,
  } = useSchedules();

  const modalRef = useRef();

  const handleCreateShift = async () => {
    // Return error if form is not filled out
    if (!u_id || !date || !shift_start_value || !shift_end_value) {
      return setError("Employee and shift required");
    }

    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    const newDate = toDate(parseISO(date));

    // Get hour and minute for new date object
    const startTimeHour = shift_start_value.split(" ")[0];
    const startTimeMinute = shift_start_value.split(" ")[1];
    // Get hour and minute for new date object
    const endTimeHour = shift_end_value.split(" ")[0];
    const endTimeMinute = shift_end_value.split(" ")[1];
    // Create new date objects with year, month, day, hour, minute
    const shift_start = toDate(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        startTimeHour,
        startTimeMinute
      )
    ).toLocaleString();

    const shift_end = toDate(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        endTimeHour,
        endTimeMinute
      )
    ).toLocaleString();

    const body = { u_id, shift_start, shift_end };
    await createShift(body, tokenConfig);

    await handleFetchSchedule();

    setIsUpdating(false);
    dispatch({ type: "TOGGLE_SHOW_ADD_SHIFT" });
  };

  const handleShowAddShift = () => {
    dispatch({
      type: "SET_ANY",
      payload: {
        shift_start_value: store.store_open_value,
        shift_end_value: store.store_close_value,
        showAddShift: true,
      },
    });
  };

  const handleCancelAddShift = () => {
    dispatch({
      type: "SET_ANY",
      payload: {
        shift_start_value: "",
        shift_end_value: "",
        showAddShift: false,
      },
    });
    setUId("");
    setError("");
  };

  const handleSelectPreset = (shiftValue) => {
    if (!shiftValue) return;
    dispatch({
      type: "SET_ANY",
      payload: {
        shift_start_value: shiftValue.split("-")[0],
        shift_end_value: shiftValue.split("-")[1],
      },
    });
  };

  return (
    <>
      <CSSTransition
        in={showAddShift}
        timeout={300}
        classNames="modal-fade"
        unmountOnExit
        nodeRef={modalRef}
      >
        <div ref={modalRef}>
          <div // Dimmed overlay with active modal
            className="modal-container"
            onClick={() => dispatch({ type: "TOGGLE_SHOW_ADD_SHIFT" })}
          ></div>
          <div className="modal">
            <div className="p-3">
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Date</p>
                <input
                  type="date"
                  onChange={({ target }) => setDate(target.value)}
                />
              </div>
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Employee</p>
                <select onChange={({ target }) => setUId(target.value)}>
                  <option value="">Select...</option>
                  {users.map((user, i) => (
                    <option key={i} value={user.u_id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex my-2">
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
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">Start</p>
                <select
                  value={shift_start_value}
                  disabled={isUpdating}
                  onChange={({ target }) =>
                    dispatch({
                      type: "SET_ANY",
                      payload: { shift_start_value: target.value },
                    })
                  }
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
              <div className="flex my-2">
                <p className="mr-1 schedules-mobile-text">End</p>
                <select
                  value={shift_end_value}
                  disabled={isUpdating}
                  onChange={({ target }) =>
                    dispatch({
                      type: "SET_ANY",
                      payload: { shift_end_value: target.value },
                    })
                  }
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
              {error && <p className="red schedules-mobile-text">{error}</p>}
              <div className="mt-1">
                <button
                  className="btn-md hovered m-1 bg-white"
                  onClick={() => handleCreateShift(u_id)}
                >
                  Save
                </button>
                <button
                  className="btn-md hovered m-1 bg-white"
                  onClick={handleCancelAddShift}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      {!showAddShift && (
        // Hide add button when modal is active
        <div
          className="add-shift-btn flex flex-center pointer"
          onClick={handleShowAddShift}
        >
          <p className="white text-7">
            <i className="fas fa-plus" />
          </p>
        </div>
      )}
    </>
  );
};

import React, { useState } from "react";
import { useSchedules } from "./SchedulesContext";
import { Spinner } from "../../../components/Spinner";

import { isAuthenticated } from "../../../services/auth";
import { createPreset, getPresets } from "../../../services/presets";
import {
  createShift,
  deleteShift,
  updateShift,
} from "../../../services/shifts";

export const EditShift = ({ shift, u_id, a_i }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmTooltip, setShowConfirmTooltip] = useState(false);
  const [showPresetTooltip, setShowPresetTooltip] = useState(false);
  const [showClashTooltip, setShowClashTooltip] = useState(false);

  const {
    state: { days, times, presets, store, shift_start_value, shift_end_value },
    dispatch,
    handleFetchSchedule,
  } = useSchedules();

  // Can create or update shift based on s_id being provided
  const handleSaveShift = async (u_id, a_i, s_id) => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    // Get shift date
    const date = new Date(days[a_i]);
    // Get hour and minute for new date object
    const startTimeHour = shift_start_value.split(" ")[0];
    const startTimeMinute = shift_start_value.split(" ")[1];
    // Get hour and minute for new date object
    const endTimeHour = shift_end_value.split(" ")[0];
    const endTimeMinute = shift_end_value.split(" ")[1];
    // Create new date objects with year, month, day, hour, minute
    const shift_start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTimeHour,
      startTimeMinute
    ).toLocaleString();

    const shift_end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTimeHour,
      endTimeMinute
    ).toLocaleString();

    const body = { u_id, shift_start, shift_end };

    if (s_id) {
      // Update shift if shift id is provided
      await updateShift(s_id, body, tokenConfig);
    } else {
      // Create new shift if no shift id is provided
      await createShift(body, tokenConfig);
    }

    // Refresh schedule
    await handleFetchSchedule();

    dispatch({ type: "CLEAR_INDEXES" });
    setShowConfirmTooltip(false);
    setIsUpdating(false);
  };

  const handleCancelShift = () => {
    dispatch({ type: "CLEAR_INDEXES" });
    setShowClashTooltip(false);
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

  const handleSavePreset = async () => {
    const tokenConfig = isAuthenticated();
    let level;
    let shift_start;
    let shift_end;
    for (let i = 0; i < presets.length; i++) {
      // Check if preset already exists
      if (
        shift_start_value === presets[i].shift_start_value &&
        shift_end_value === presets[i].shift_end_value
      ) {
        alert("Preset already saved");
        return;
      }
    }
    // Match shift_start/end && values between times array and times dropdown list
    for (let i = 0; i < times.length; i++) {
      if (shift_start_value === times[i].value) {
        // Assign only start time level for sorting when displayed in the list
        level = times[i].level;
        shift_start = times[i].time;
      }
      if (shift_end_value === times[i].value) {
        shift_end = times[i].time;
      }
    }

    const body = {
        shift_start,
        shift_end,
        shift_start_value,
        shift_end_value,
        level,
    };
    // Create new preset in db
    await createPreset(body, tokenConfig);

    // Refresh presets list
    const newPresets = await getPresets();
    dispatch({ type: "SET_ANY", payload: { presets: newPresets } });

    alert("Preset saved");
  };

  const handleRemoveShift = async (s_id) => {
    const toDelete = window.confirm(
      "Are you sure you want to remove this shift?"
    );
    if (toDelete) {
      setIsUpdating(true);
      const tokenConfig = isAuthenticated();
      await deleteShift(s_id, tokenConfig);

      // Refresh schedule
      await handleFetchSchedule();

      dispatch({ type: "CLEAR_INDEXES" });
      setShowClashTooltip(false);
      setIsUpdating(false);
    }
  };

  return (
    <td className="bg-blue-grey-lighten-5">
      <div className="flex justify-evenly mt-1">
        <p>Preset</p>
        <select
          className="w-60 schedules-text"
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
      <hr className="my-1" />
      <div className="flex justify-evenly mb-1">
        <p>Start</p>
        <select
          className="w-60 schedules-text"
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
      <div className="flex justify-evenly mb-1">
        <p className="mr-1">End</p>
        <select
          className="w-60 schedules-text"
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
      {isUpdating ? (
        <Spinner type="ThreeDots" height={12} />
      ) : (
        // Render action buttons with icons
        <div className="my-2 w-100 flex justify-evenly">
          <div
            style={{ minHeight: "25px" }}
            className="w-100 pointer-no-dec hovered border-solid-1 bg-white relative flex flex-center"
            onClick={() => handleSaveShift(u_id, a_i, shift.s_id)}
          >
            <span // Tooltip
              className={`tooltip ${
                showConfirmTooltip && "tooltip-open tooltip-mt-1"
              }`}
            >
              Confirm
            </span>
            <i
              className="fas fa-check schedules-text p-1"
              onMouseEnter={() => setShowConfirmTooltip(true)}
              onMouseLeave={() => setShowConfirmTooltip(false)}
            />
          </div>
          <div
            style={{ minHeight: "25px" }}
            className="w-100 pointer-no-dec hovered border-solid-1 bg-white relative flex flex-center"
            onClick={() => handleSavePreset()}
          >
            <span // Tooltip
              className={`tooltip ${
                showPresetTooltip && "tooltip-open tooltip-mt-2"
              }`}
            >
              Save preset
            </span>
            <i
              className="fas fa-star schedules-text p-1"
              onMouseEnter={() => setShowPresetTooltip(true)}
              onMouseLeave={() => setShowPresetTooltip(false)}
            />
          </div>
          <div
            style={{ minHeight: "25px" }}
            className="w-100 pointer-no-dec hovered border-solid-1 bg-white relative flex flex-center"
            onClick={() =>
              shift.s_id ? handleRemoveShift(shift.s_id) : handleCancelShift()
            }
          >
            <span // Tooltip
              className={`tooltip ${
                showClashTooltip && "tooltip-open tooltip-mt-1"
              }`}
            >
              {shift.shift_end ? "Remove" : "Close"}
            </span>
            <i
              className={`fas ${
                // Render appropriate icon based on shift existing or not
                shift.shift_end ? "fa-trash-alt" : "fa-times"
              } schedules-text p-1`}
              onMouseEnter={() => setShowClashTooltip(true)}
              onMouseLeave={() => setShowClashTooltip(false)}
            />
          </div>
        </div>
      )}
    </td>
  );
};

import React from "react";
import { format, addWeeks, subWeeks, parseISO, toDate } from "date-fns";

import { isAuthenticated } from "../../../services/auth";
import { useSchedules } from "./SchedulesContext";
import {
  clearWeeklySchedule,
  createCopyOfWeeklySchedule,
} from "../../../services/shifts";

export const SchedulesController = () => {
  const {
    state: {
      days,
      users,
      requests,
      datepicker,
      isModifying,
    },
    dispatch,
    handleDateChange,
    handleFetchSchedule
  } = useSchedules();

  const handleCopyWeeklySchedule = async () => {
    const doCopy = window.confirm(
      "Copy schedule to next week? Any shifts already saved will be overwritten."
    );
    if (doCopy) {
      const tokenConfig = isAuthenticated();
      dispatch({ type: "TOGGLE_CHANGE_DATE" });

      let shifts = [];
      // Copy shifts from current week for all users
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].shifts.length; j++) {
          if (users[i].shifts[j].shift_end !== null) {
            let shift = {
              u_id: users[i].u_id,
              shift_start: format(
                addWeeks(parseISO(users[i].shifts[j].shift_start), 1),
                "yyyy-MM-dd'T'HH:mm:ss"
              ),
              shift_end: format(
                addWeeks(parseISO(users[i].shifts[j].shift_end), 1),
                "yyyy-MM-dd'T'HH:mm:ss"
              ),
            };
            shifts.push(shift);
          }
        }
      }

      const body = {
        shifts,
        weekStart: addWeeks(parseISO(days[0]), 1),
        weekEnd: addWeeks(parseISO(days[6]), 1),
      };

      // Copy shifts from current week to the following week
      await createCopyOfWeeklySchedule(body, tokenConfig);
      // Display following week after copying schedule
      await handleClickNextWeek();
    }
  };

  const handleClearWeeklySchedule = async () => {
    const doClear = window.confirm("Clear all shifts for this week?");
    if (doClear) {
      const tokenConfig = isAuthenticated();
      dispatch({ type: "TOGGLE_CHANGE_DATE" });

      // Delete all shifts for the current week
      await clearWeeklySchedule(days[0], days[6], tokenConfig);
      // Refresh schedule
      await handleFetchSchedule();
    }
  };

  // Set datepicker value and fetch data using selected date
  const handleDatepicker = (date) => {
    dispatch({
      type: "SET_ANY",
      payload: { datepicker: date },
    });
    handleDateChange(date);
  }

  const handleClickPrevWeek = async () => {
    // New Date object will adjust hours based on timezone so use toDate
    let date = subWeeks(toDate(parseISO(datepicker)), 1);
    // Format date so datepicker can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    handleDatepicker(formattedDate);
  };

  const handleClickNextWeek = async () => {
    // New Date object will adjust hours based on timezone so use toDate
    let date = addWeeks(toDate(parseISO(datepicker)), 1);
    // Format date so datepicker can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    handleDatepicker(formattedDate);
  };

  // Format date to 'mm/dd/yyyy' without using new Date
  // Production fetches dates without timezone, while dev
  // fetches with timezone.. so manually parse date
  const handleFormatDate = (date) => {
    const init = date.split("T")[0];
    const split = init.split("-");
    const newDate = `${split[1]}/${split[2]}/${split[0]}`;
    return newDate;
  };

  return (
    <div className="schedules-controller">
      <div className="select-week">
        <div className="pointer" onClick={() => handleClickPrevWeek()}>
          <em className="text-3">Prev&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-left" />
          </p>
        </div>
        <div id="controller-date" className="relative">
          <input
            type="date"
            className="border-solid-1 border-smooth"
            value={datepicker} // Datepicker must be yyyy-mm-dd format
            onChange={({ target }) => handleDatepicker(target.value)}
          />
          <div className="absolute">&nbsp;</div>
        </div>
        <div className="pointer" onClick={() => handleClickNextWeek()}>
          <em className="text-3">Next&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-right" />
          </p>
        </div>
      </div>

      <div className="schedules-requests">
        <div className="mx-3">
          <p className="text-3">
            <strong>Approved Requests</strong>
          </p>
          {requests.length ? (
            requests.map((request, i) => (
              <div key={i}>
                <p className="schedules-text">
                  {request.first_name} {request.last_name}:
                  {request.requested_dates.map((date, r_i) => (
                    <span key={r_i}>
                      &nbsp;
                      {r_i === request.requested_dates.length - 1
                        ? handleFormatDate(date)
                        : `${handleFormatDate(date)},`}
                    </span>
                  ))}
                </p>
              </div>
            ))
          ) : (
            <p className="text-3">None</p>
          )}
        </div>
        <div>
          <button
            className={`controller-btn ${!isModifying && "btn-hovered"}`}
            onClick={handleCopyWeeklySchedule}
            disabled={isModifying}
          >
            Copy
          </button>
          <button
            className={`controller-btn ${!isModifying && "btn-hovered"}`}
            onClick={handleClearWeeklySchedule}
            disabled={isModifying}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

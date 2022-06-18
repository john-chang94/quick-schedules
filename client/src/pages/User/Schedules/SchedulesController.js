import React from "react";
import { toDate, format, subWeeks, addWeeks, parseISO } from "date-fns";
import { useSchedules } from "../../Admin/Schedules/SchedulesContext";

export const SchedulesController = () => {
  const {
    state: { datepicker },
    dispatch,
    handleDateChange,
  } = useSchedules();

  // Set datepicker value and fetch data using selected date
  const handleDatepicker = (date) => {
    dispatch({
      type: "SET_ANY",
      payload: { datepicker: date },
    });
    handleDateChange(date);
  };

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
    </div>
  );
};

import { useState, useEffect } from "react";
import { isAuthenticated } from "../../services/auth";
import { createPreset, getPresets } from "../../services/presets";
import { getTimes } from "../../services/store";
import {
  createShift,
  getUsersSchedulesByDate,
  getUsersSchedulesByDateMobile,
  deleteShift,
  updateShift,
  createCopyOfWeeklySchedule,
  clearWeeklySchedule,
} from "../../services/shifts";
import { getUsersAvailabilities } from "../../services/users";
import {
  startOfToday,
  startOfWeek,
  addWeeks,
  subWeeks,
  subMonths,
  parseISO,
  format,
  toDate,
} from "date-fns";
import Loader from "react-loader-spinner";
import { getRequestsByStatusAndDate } from "../../services/requests";
import { getStoreHours } from "../../services/store";
import SchedulesMobile from "./schedulesMobile";

export default function AdminSchedules() {
  const [availabilities, setAvailabilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersMobile, setUsersMobile] = useState([]);
  const [requests, setRequests] = useState([]);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [presets, setPresets] = useState([]);
  const [store, setStore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  // Used for datepicker
  const [dateISO, setDateISO] = useState(format(startOfToday(), "yyyy-MM-dd"));
  // Used for getting time values when saving a shift
  const [shift_start_value, setShiftStartValue] = useState("0 0");
  const [shift_end_value, setShiftEndValue] = useState("0 0");
  // Used to render edit shift mode for selected date and employee only
  const [userData, setUserData] = useState(null);
  const [availabilityIndex, setAvailabilityIndex] = useState(null);

  // Sort schedules array for mobile
  // Takes in days array that is returned from getDatesOfTheWeek()
  // Will not work with days state because it is async
  const handleSortUsersMobile = (arr, days) => {
    // Add date labels for mobile schedules display
    for (let i = 0; i < days.length; i++) {
      arr.push({ shift_start: days[i], label: true });
    }

    return arr.sort(
      (a, b) => new Date(a.shift_start) - new Date(b.shift_start)
    );
  };

  // Fetch shifts for the week (used for refreshing after editing shifts)
  const handleFetchSchedule = async () => {
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    usersMobile = handleSortUsersMobile(usersMobile, days);

    setUsers(users);
    setUsersMobile(usersMobile);
  };

  // For init load and datepicker
  const getDatesOfTheWeek = async (selectedDate) => {
    let dateToAdd;
    if (selectedDate) {
      // Create new date with separate identifiers because it is inaccurate for Mondays
      let year = selectedDate.split("-")[0];
      let month = selectedDate.split("-")[1];
      let day = selectedDate.split("-")[2];
      // Subtract one month because they are counted from zero
      // i.e. "2022-02-18" is considered March
      dateToAdd = startOfWeek(subMonths(new Date(year, month, day), 1), {
        weekStartsOn: 1,
      });
      setDateISO(selectedDate); // For datepicker value
    } else {
      dateToAdd = startOfWeek(new Date(), { weekStartsOn: 1 });
    }

    let daysArray = [];
    // Get dates in current work week
    for (let i = 0; i < 7; i++) {
      daysArray.push(dateToAdd.toISOString());
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    // Return days array for immediate use in various functions
    return daysArray;
  };

  // Can create or update shift based on s_id being provided
  const handleSaveShift = async (u_id, dayIndex, s_id) => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    // Get shift date
    const date = new Date(days[dayIndex]);
    // Get hour and minute in INT data type for date object
    const startTimeHour = parseInt(shift_start_value.split(" ")[0]);
    const startTimeMinute = parseInt(shift_start_value.split(" ")[1]);
    // Get hour and minute in INT data type for date object
    const endTimeHour = parseInt(shift_end_value.split(" ")[0]);
    const endTimeMinute = parseInt(shift_end_value.split(" ")[1]);
    // Create new date objects with year, month, day, hour, minute, and timezone
    const shift_start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTimeHour,
      startTimeMinute
    ).toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }); // Local timezone

    const shift_end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTimeHour,
      endTimeMinute
    ).toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const body = { u_id, shift_start, shift_end };
    if (s_id) {
      await updateShift(s_id, body, tokenConfig);
    } else {
      await createShift(body, tokenConfig);
    }

    // Refresh schedule
    await handleFetchSchedule();

    setUserData("");
    setAvailabilityIndex("");
    setIsUpdating(false);
  };

  const handleCopyWeeklySchedule = async () => {
    const doCopy = window.confirm(
      "Copy schedule to next week? Any shifts already saved will be overwritten."
    );
    if (doCopy) {
      const tokenConfig = isAuthenticated();
      setIsModifying(true);
      setIsLoading(true);

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
      // Refresh schedule
      await handleFetchSchedule();
      // Display following week after copying schedule
      handleNextWeek();
      setIsModifying(false);
      setIsLoading(false);
    }
  };

  const handleClearWeeklySchedule = async () => {
    const doClear = window.confirm("Clear all shifts for this week?");
    if (doClear) {
      const tokenConfig = isAuthenticated();
      setIsModifying(true);
      setIsLoading(true);

      // Delete all shifts for the current week
      await clearWeeklySchedule(days[0], days[6], tokenConfig);
      // Refresh schedule
      await handleFetchSchedule();

      setIsModifying(false);
      setIsLoading(false);
    }
  };

  const handleCancelShift = () => {
    setUserData("");
    setAvailabilityIndex("");
  };

  // Render edit shift (new)
  const handleShiftClickNew = (u_id, index) => {
    setUserData(u_id);
    setAvailabilityIndex(index);
    setShiftStartValue(store.store_open_value);
    setShiftEndValue(store.store_close_value);
  };

  // Render edit shift (update)
  const handleShiftClickEdit = (
    u_id,
    index,
    startStartValue,
    endStartValue
  ) => {
    setUserData(u_id);
    setAvailabilityIndex(index);
    setShiftStartValue(startStartValue);
    setShiftEndValue(endStartValue);
  };

  // Get new dates for the week and fetch schedule
  const handleDateSelector = async (date) => {
    const days = await getDatesOfTheWeek(date);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    const requests = await getRequestsByStatusAndDate(
      "Approved",
      days[0],
      days[6]
    );
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    usersMobile = handleSortUsersMobile(usersMobile, days);

    setDays(days);
    setUsers(users);
    setRequests(requests);
    setUsersMobile(usersMobile);
  };

  const handlePreviousWeek = async () => {
    // New Date object will adjust hours based on timezone so use toDate
    let date = subWeeks(toDate(parseISO(dateISO)), 1);
    // Format date so date selector can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    setDateISO(formattedDate);

    // Get new dates for the week and fetch schedule
    const days = await getDatesOfTheWeek(formattedDate);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    const requests = await getRequestsByStatusAndDate(
      "Approved",
      days[0],
      days[6]
    );
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    usersMobile = handleSortUsersMobile(usersMobile, days);

    setDays(days);
    setUsers(users);
    setRequests(requests);
    setUsersMobile(usersMobile);
    setUserData("");
    setAvailabilityIndex("");
  };

  const handleNextWeek = async () => {
    // New Date object will adjust hours based on timezone so use toDate
    let date = addWeeks(toDate(parseISO(dateISO)), 1);
    // Format date so date selector can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    setDateISO(formattedDate);

    // Get new dates for the week and fetch schedule
    const days = await getDatesOfTheWeek(formattedDate);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    const requests = await getRequestsByStatusAndDate(
      "Approved",
      days[0],
      days[6]
    );
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    usersMobile = handleSortUsersMobile(usersMobile, days);

    setDays(days);
    setUsers(users);
    setRequests(requests);
    setUsersMobile(usersMobile);
    setUserData("");
    setAvailabilityIndex("");
  };

  const handleSelectPreset = (shiftValue) => {
    if (!shiftValue) return;
    setShiftStartValue(shiftValue.split("-")[0]);
    setShiftEndValue(shiftValue.split("-")[1]);
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

    // Create new preset in db
    const body = {
      shift_start,
      shift_end,
      shift_start_value,
      shift_end_value,
      level,
    };
    await createPreset(body, tokenConfig);

    // Refresh presets list
    const newPresets = await getPresets();
    setPresets(newPresets);

    alert("Preset saved");
  };

  const handleRemoveShift = async (s_id) => {
    const toDelete = window.confirm(
      "Are you sure you want to remove this shift?"
    );
    if (toDelete) {
      const tokenConfig = isAuthenticated();
      setIsUpdating(true);
      await deleteShift(s_id, tokenConfig);

      // Refresh schedule
      await handleFetchSchedule();
      setUserData("");
      setAvailabilityIndex("");
      setIsUpdating(false);
    }
  };

  const getTimeValue = (shift) => {
    const date = new Date(shift);
    const hour = date.getHours();
    const min = date.getMinutes();
    const values = `${hour.toString()} ${min.toString()}`;
    return values;
  };

  const getTime = (shift) => {
    return new Date(shift).toLocaleTimeString().replace(":00 ", " ");
  };

  const renderShift = (u_id, a_i, shift_start, shift_end) => (
    <td
      key={a_i}
      className="pointer schedules-text bg-blue-lighten-4"
      onClick={() =>
        handleShiftClickEdit(
          u_id,
          a_i,
          getTimeValue(shift_start),
          getTimeValue(shift_end)
        )
      }
    >
      {getTime(shift_start)} -&nbsp;
      {getTime(shift_end)}
    </td>
  );

  const renderBlank = (u_id, a_i, time) => (
    <td
      key={a_i}
      // Keep bg color black if employee is 'N/A' for availability
      className={`pointer ${
        time.start_time === "N/A" ? "bg-black" : "hovered"
      }`}
      onClick={() => handleShiftClickNew(u_id, a_i)}
    ></td>
  );

  const renderEditShift = (u_id, dayIndex, shift) => (
    <td key={dayIndex} className="bg-blue-grey-lighten-5">
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
        <p className="mr-1">End</p>
        <select
          className="w-60 schedules-text"
          value={shift_end_value}
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
      {isUpdating ? (
        <div className="my-1">
          <Loader type="ThreeDots" color="rgb(50, 110, 150)" height={12} />
        </div>
      ) : (
        <div className="my-2 w-100 flex justify-evenly">
          <div
            className="p-1 w-100 pointer hovered border-solid-1 bg-white"
            onClick={() => handleSaveShift(u_id, dayIndex, shift.s_id)}
          >
            <i className="fas fa-check schedules-text"></i>
          </div>
          <div
            className="p-1 w-100 pointer hovered border-solid-1 bg-white"
            onClick={() => handleSavePreset()}
          >
            <i className="fas fa-star schedules-text"></i>
          </div>
          <div
            className="p-1 w-100 pointer hovered border-solid-1 bg-white"
            onClick={() =>
              shift.s_id ? handleRemoveShift(shift.s_id) : handleCancelShift()
            }
          >
            {shift.shift_end === null ? (
              // Render X icon to close if new shift
              <i className="fas fa-times schedules-text"></i>
            ) : (
              // Or render trash icon to delete if editing shift
              <i className="fas fa-trash-alt schedules-text"></i>
            )}
          </div>
        </div>
      )}
    </td>
  );

  const RenderAvailability = () => (
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

  const RenderController = () => (
    <div className="schedules-controller">
      <div className="select-week">
        <div className="pointer" onClick={() => handlePreviousWeek()}>
          <em className="text-3">Prev&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-left"></i>
          </p>
        </div>
        <div id="controller-date" className="relative">
          <input
            type="date"
            className="border-solid-1 border-smooth"
            value={dateISO} // Datepicker must be yyyy-mm-dd format
            onChange={({ target }) => handleDateSelector(target.value)}
          />
          <div className="absolute">&nbsp;</div>
        </div>
        <div className="pointer" onClick={() => handleNextWeek()}>
          <em className="text-3">Next&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-right"></i>
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
                        ? new Date(date).toLocaleDateString()
                        : `${new Date(date).toLocaleDateString()},`}
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

  const RenderSchedule = () =>
    isLoading ? (
      <div className="text-center" style={{ marginTop: "70px" }}>
        <Loader type="Oval" color="rgb(50, 110, 150)" />
      </div>
    ) : (
      <table className="schedules-table w-100 border-collapse text-center table-fixed schedules-text">
        <tbody>
          <tr>
            <td className="bg-x-light-gray">
              <strong>Name</strong>
            </td>
            {days &&
              days.map((day, i) => (
                <td key={i} className="bg-x-light-gray">
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
                  <em>{user.level === 2 ? "A. Manager" : user.title}</em>
                </td>
                {user.availability.map((time, a_i) =>
                  // Only render edit mode for the selected date and employee
                  userData === user.u_id && availabilityIndex === a_i
                    ? renderEditShift(user.u_id, a_i, user.shifts[a_i])
                    : // Render shifts if they exist during the selected week
                    user.shifts[a_i].shift_end === null
                    ? renderBlank(user.u_id, a_i, time)
                    : renderShift(
                        user.u_id,
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

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const times = await getTimes();
      const availabilities = await getUsersAvailabilities();
      const presets = await getPresets();
      const store = await getStoreHours();
      const days = await getDatesOfTheWeek();
      const users = await getUsersSchedulesByDate(days[0], days[6]);
      const requests = await getRequestsByStatusAndDate(
        "Approved",
        days[0],
        days[6]
      );

      let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
      usersMobile = handleSortUsersMobile(usersMobile, days);

      if (isMounted) {
        setDays(days);
        setTimes(times);
        setAvailabilities(availabilities);
        setPresets(presets);
        setStore(store);
        setUsers(users);
        setRequests(requests);
        setUsersMobile(usersMobile);
        setShiftStartValue(store.store_open_value);
        setShiftEndValue(store.store_close_value);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div>
          <RenderController />
          <RenderSchedule />
          <RenderAvailability />
          <SchedulesMobile
            usersMobile={usersMobile}
            users={users}
            days={days}
            times={times}
            store={store}
            presets={presets}
            getTime={getTime}
            getTimeValue={getTimeValue}
            handleFetchSchedule={handleFetchSchedule}
          />
        </div>
      )}
    </>
  );
}

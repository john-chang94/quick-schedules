import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import {
  getUsersSchedulesByDate,
  getUsersSchedulesByDateMobile,
} from "../../services/shifts";
import {
  startOfToday,
  startOfWeek,
  subWeeks,
  addWeeks,
  subMonths,
  toDate,
  parseISO,
  format,
} from "date-fns";

export default function UserSchedules() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersMobile, setUsersMobile] = useState([]);
  const [days, setDays] = useState([]);
  // Used for datepicker
  const [dateISO, setDateISO] = useState(format(startOfToday(), "yyyy-MM-dd"));

  const getDatesOfTheWeek = async (selectedDate) => {
    let dateToAdd;
    if (selectedDate) {
      // Create new date with separate identifiers because instantiating
      // a new date string without a time will assume UTC time
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
    for (let i = 0; i < 7; i++) {
      daysArray.push(dateToAdd.toISOString());
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    return daysArray;
  };

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

  const getTime = (shift) => {
    return new Date(shift).toLocaleTimeString().replace(":00 ", " ");
  };

  const handleDatePicker = async (date) => {
    setIsLoadingSchedule(true);
    const days = await getDatesOfTheWeek(date);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    if (usersMobile.length) {
      usersMobile = handleSortUsersMobile(usersMobile, days);
    }

    setDays(days);
    setUsers(users);
    setUsersMobile(usersMobile);
    setIsLoadingSchedule(false);
  };

  const handlePreviousWeek = async () => {
    setIsLoadingSchedule(true);
    // New Date object will adjust hours based on timezone so use toDate
    let date = subWeeks(toDate(parseISO(dateISO)), 1);
    // Format date so datepicker can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    setDateISO(formattedDate);

    // Get new dates for the week and fetch schedule
    const days = await getDatesOfTheWeek(formattedDate);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    if (usersMobile.length) {
      usersMobile = handleSortUsersMobile(usersMobile, days);
    }

    setDays(days);
    setUsers(users);
    setUsersMobile(usersMobile);
    setIsLoadingSchedule(false);
  };

  const handleNextWeek = async () => {
    setIsLoadingSchedule(true);
    // New Date object will adjust hours based on timezone so use toDate
    let date = addWeeks(toDate(parseISO(dateISO)), 1);
    // Format date so datepicker can read it
    let formattedDate = format(date, "yyyy-MM-dd");
    setDateISO(formattedDate);

    // Get new dates for the week and fetch schedule
    const days = await getDatesOfTheWeek(formattedDate);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    if (usersMobile.length) {
      usersMobile = handleSortUsersMobile(usersMobile, days);
    }

    setDays(days);
    setUsers(users);
    setUsersMobile(usersMobile);
    setIsLoadingSchedule(false);
  };

  const renderBlank = (a_i, time) => (
    <td
      key={a_i}
      // Keep bg color black if employee is 'N/A' for availability
      className={`${time.start_time === "N/A" && "bg-black"}`}
    ></td>
  );

  const renderShift = (a_i, shift_start, shift_end) => (
    <td key={a_i} className="bg-blue-lighten-4">
      {getTime(shift_start)} -&nbsp;
      {getTime(shift_end)}
    </td>
  );

  const renderController = () => (
    <div className="schedules-controller">
      <div className="select-week">
        <div className="pointer" onClick={() => handlePreviousWeek()}>
          <em className="text-3">Prev&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-left" />
          </p>
        </div>
        <div id="controller-date" className="relative">
          <input
            type="date"
            className="border-solid-1 border-smooth"
            value={dateISO} // Datepicker must be yyyy-mm-dd format
            onChange={({ target }) => handleDatePicker(target.value)}
          />
          <div className="absolute">&nbsp;</div>
        </div>
        <div className="pointer" onClick={() => handleNextWeek()}>
          <em className="text-3">Next&nbsp;week</em>
          <p>
            <i className="fas fa-angle-double-right" />
          </p>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () =>
    isLoadingSchedule ? (
      <div className="text-center" style={{ marginTop: "70px" }}>
        <Loader type="Oval" color="rgb(50, 110, 150)" />
      </div>
    ) : (
      <table className="schedules-table w-100 mt-1 border-collapse text-center table-fixed schedules-text">
        <tbody>
          <tr>
            <td className="bg-grey-lighten-3">
              <strong>Name</strong>
            </td>
            {days &&
              days.map((day, i) => (
                <td key={i} className="bg-grey-lighten-3">
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
                  <em>{user.title}</em>
                </td>
                {user.availability.map((time, a_i) =>
                  user.shifts[a_i].shift_end === null
                    ? renderBlank(a_i, time)
                    : renderShift(
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

  const renderMobileSchedules = () => (
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

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const days = await getDatesOfTheWeek();
      const users = await getUsersSchedulesByDate(days[0], days[6]);
      let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
      if (usersMobile.length) {
        usersMobile = handleSortUsersMobile(usersMobile, days);
      }

      if (isMounted) {
        setDays(days);
        setUsers(users);
        setUsersMobile(usersMobile);
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div>
          {renderController()}
          {renderSchedule()}
          {!isLoadingSchedule && renderMobileSchedules()}
        </div>
      )}
    </div>
  );
}

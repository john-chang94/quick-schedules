import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { startOfWeek, format, startOfToday, subMonths } from "date-fns";

import {
  getUsersSchedulesByDate,
  getUsersSchedulesByDateMobile,
} from "../../../services/shifts";
import { getPresets } from "../../../services/presets";
import { getRequestsByStatusAndDate } from "../../../services/requests";
import { getStoreHours, getTimes } from "../../../services/store";
import { getUsersAvailabilities } from "../../../services/users";

export const SchedulesContext = createContext();

export const useSchedules = () => useContext(SchedulesContext);

export default function SchedulesContextProvider({ children }) {
  // For init load in schedules only; access in component
  const [isLoading, setIsLoading] = useState(true);

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case "SET_ANY":
        return {
          ...state,
          ...payload,
        };
      case "TOGGLE_IS_LOADING_SCHEDULE":
        return {
          ...state,
          isLoadingSchedule: !state.isLoadingSchedule,
        };
      case "TOGGLE_SHOW_ADD_SHIFT":
        return {
          ...state,
          showAddShift: !state.showAddShift,
        };
      case "TOGGLE_CHANGE_DATE":
        return {
          ...state,
          isModifying: !state.isModifying,
          isLoadingSchedule: !state.isLoadingSchedule,
        };
      case "ON_CLICK_SHIFT_NEW":
        return {
          ...state,
          ...payload,
          shift_start_value: state.store.store_open_value,
          shift_end_value: state.store.store_close_value,
        };
      case "ON_CLICK_SHIFT_EDIT":
        return {
          ...state,
          ...payload,
        };
      case "CLEAR_INDEXES":
        return {
          ...state,
          userId: null,
          availabilityIndex: null,
        };
      default:
        return initialState;
    }
  };

  const initialState = {
    days: [],
    times: [],
    presets: [],
    availabilities: [],
    store: null,
    users: [],
    usersMobile: [],
    requests: [],
    isModifying: false,
    isLoadingSchedule: false,
    showAddShift: false,
    datepicker: format(startOfToday(), "yyyy-MM-dd"),
    // Used for getting time values when saving a shift
    shift_start_value: "0 0",
    shift_end_value: "0 0",
    // Used to render edit shift mode for selected date and employee only
    userId: null,
    availabilityIndex: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // For init load and date change
  const getDatesOfTheWeek = async (selectedDate) => {
    // Create new date with separate identifiers because instantiating
    // a new date string without a time will roll back a day
    let year = selectedDate.split("-")[0];
    let month = selectedDate.split("-")[1];
    let day = selectedDate.split("-")[2];
    // Subtract one month because they are counted from zero
    let dateToAdd = startOfWeek(subMonths(new Date(year, month, day), 1), {
      weekStartsOn: 1,
    });
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
    for (let day of days) {
      arr.push({ shift_start: day, label: true });
    }
    return arr.sort(
      (a, b) => new Date(a.shift_start) - new Date(b.shift_start)
    );
  };

  // Fetch schedule after editing a shift
  const handleFetchSchedule = async () => {
    const users = await getUsersSchedulesByDate(state.days[0], state.days[6]);
    let usersMobile = await getUsersSchedulesByDateMobile(
      state.days[0],
      state.days[6]
    );
    if (usersMobile.length > 0) {
      usersMobile = handleSortUsersMobile(usersMobile, state.days);
    }

    dispatch({ type: "SET_ANY", payload: { users, usersMobile } });
  };

  // Fetch schedule when changing dates
  const handleDateChange = async (date) => {
    dispatch({ type: "TOGGLE_IS_LOADING_SCHEDULE" });
    const days = await getDatesOfTheWeek(date);
    const users = await getUsersSchedulesByDate(days[0], days[6]);
    const requests = await getRequestsByStatusAndDate(
      "Approved",
      days[0],
      days[6]
    );
    let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
    if (usersMobile.length > 0) {
      usersMobile = handleSortUsersMobile(usersMobile, days);
    }

    dispatch({
      type: "SET_ANY",
      payload: {
        days,
        users,
        requests,
        usersMobile,
        isModifying: false,
        isLoadingSchedule: false,
        userId: null,
        availabilityIndex: null,
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const days = await getDatesOfTheWeek(format(new Date(), "yyyy-MM-dd"));
      const times = await getTimes();
      const presets = await getPresets();
      const availabilities = await getUsersAvailabilities();
      const store = await getStoreHours();
      const users = await getUsersSchedulesByDate(days[0], days[6]);
      const requests = await getRequestsByStatusAndDate(
        "Approved",
        days[0],
        days[6]
      );
      let usersMobile = await getUsersSchedulesByDateMobile(days[0], days[6]);
      if (usersMobile.length) {
        usersMobile = handleSortUsersMobile(usersMobile, days);
      }

      if (isMounted) {
        dispatch({
          type: "SET_ANY",
          payload: {
            users,
            usersMobile,
            days,
            times,
            presets,
            requests,
            availabilities,
            store,
          },
        });
        setIsLoading(false);
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, []);

  return (
    <SchedulesContext.Provider
      value={{
        state,
        dispatch,
        isLoading,
        handleDateChange,
        handleFetchSchedule,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
}

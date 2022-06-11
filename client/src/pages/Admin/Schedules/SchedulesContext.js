import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { startOfWeek } from "date-fns";

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
      case "SET_ALL_FETCHED":
        return {
          ...state,
          ...payload,
        };
      default:
        return initialState;
    }
  };

  const initialState = {};

  const [state, dispatch] = useReducer(reducer, initialState);

  const getDatesOfTheWeek = async () => {
    let dateToAdd = startOfWeek(new Date(), { weekStartsOn: 1 });
    let daysArray = [];
    // Get dates in current work week
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

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const days = await getDatesOfTheWeek();
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
          type: "SET_ALL_FETCHED",
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
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
}

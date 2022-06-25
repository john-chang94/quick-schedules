import { useEffect, useState, useContext, useReducer } from "react";
import { UserContext } from "../../../contexts/userContext";
import { isAuthenticated } from "../../../services/auth";
import Loader from "react-loader-spinner";
import EditAvailability from "./EditAvailability";
import {
  editUserAvailability,
  getUserAvailability,
} from "../../../services/users";
import { getStoreHours, getTimes } from "../../../services/store";

const initialState = {
  monStart: "",
  monEnd: "",
  tueStart: "",
  tueEnd: "",
  wedStart: "",
  wedEnd: "",
  thurStart: "",
  thurEnd: "",
  friStart: "",
  friEnd: "",
  satStart: "",
  satEnd: "",
  sunStart: "",
  sunEnd: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setValue":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialState;
    default:
      return initialState;
  }
};

export default function UserAvailability() {
  const { verifiedUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditAvailability, setShowEditAvailability] = useState(false);

  const [availability, setAvailability] = useState(null);
  const [times, setTimes] = useState(null);
  const [store, setStore] = useState(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [monStart, setMonStart] = useState("");
  const [monEnd, setMonEnd] = useState("");
  const [tueStart, setTueStart] = useState("");
  const [tueEnd, setTueEnd] = useState("");
  const [wedStart, setWedStart] = useState("");
  const [wedEnd, setWedEnd] = useState("");
  const [thurStart, setThurStart] = useState("");
  const [thurEnd, setThurEnd] = useState("");
  const [friStart, setFriStart] = useState("");
  const [friEnd, setFriEnd] = useState("");
  const [satStart, setSatStart] = useState("");
  const [satEnd, setSatEnd] = useState("");
  const [sunStart, setSunStart] = useState("");
  const [sunEnd, setSunEnd] = useState("");

  const days = [
    {
      day: "Monday",
      dayStart: monStart,
      dayEnd: monEnd,
      setDayStart: setMonStart,
      setDayEnd: setMonEnd,
    },
    {
      day: "Tuesday",
      dayStart: tueStart,
      dayEnd: tueEnd,
      setDayStart: setTueStart,
      setDayEnd: setTueEnd,
    },
    {
      day: "Wednesday",
      dayStart: wedStart,
      dayEnd: wedEnd,
      setDayStart: setWedStart,
      setDayEnd: setWedEnd,
    },
    {
      day: "Thursday",
      dayStart: thurStart,
      dayEnd: thurEnd,
      setDayStart: setThurStart,
      setDayEnd: setThurEnd,
    },
    {
      day: "Friday",
      dayStart: friStart,
      dayEnd: friEnd,
      setDayStart: setFriStart,
      setDayEnd: setFriEnd,
    },
    {
      day: "Saturday",
      dayStart: satStart,
      dayEnd: satEnd,
      setDayStart: setSatStart,
      setDayEnd: setSatEnd,
    },
    {
      day: "Sunday",
      dayStart: sunStart,
      dayEnd: sunEnd,
      setDayStart: setSunStart,
      setDayEnd: setSunEnd,
    },
  ];

  const handleShowEditAvailability = () => {
    for (let i = 0; i < availability.length; i++) {
      switch (availability[i].day) {
        case "Monday":
          setMonStart(availability[i].start_time);
          setMonEnd(availability[i].end_time);
          break;
        case "Tuesday":
          setTueStart(availability[i].start_time);
          setTueEnd(availability[i].end_time);
          break;
        case "Wednesday":
          setWedStart(availability[i].start_time);
          setWedEnd(availability[i].end_time);
          break;
        case "Thursday":
          setThurStart(availability[i].start_time);
          setThurEnd(availability[i].end_time);
          break;
        case "Friday":
          setFriStart(availability[i].start_time);
          setFriEnd(availability[i].end_time);
          break;
        case "Saturday":
          setSatStart(availability[i].start_time);
          setSatEnd(availability[i].end_time);
          break;
        case "Sunday":
          setSunStart(availability[i].start_time);
          setSunEnd(availability[i].end_time);
          break;
        default:
          return;
      }
    }

    setShowEditAvailability(true);
  };

  const handleSaveAvailability = async () => {
    setIsUpdating(true);
    const tokenConfig = isAuthenticated();
    let data = [];
    let counter = 1;

    for (let i = 0; i < days.length; i++) {
      let obj = {
        u_id: verifiedUser.u_id,
        day: days[i].day,
        start_time: days[i].dayStart,
        end_time: days[i].dayEnd,
        level: counter++,
      };

      data.push(obj);
    }

    // Check if N/A is paired with a time value
    for (let i = 0; i < data.length; i++) {
      if (
        (data[i].start_time === "N/A" && data[i].end_time !== "N/A") ||
        (data[i].start_time !== "N/A" && data[i].end_time === "N/A")
      ) {
        setIsUpdating(false);
        return alert("N/A must only be N/A");
      }
    }

    // Availability for each day is one record per update in db
    for (let i = 0; i < data.length; i++) {
      await editUserAvailability(availability[i].a_id, data[i], tokenConfig);
    }

    const newAvail = await getUserAvailability(verifiedUser.u_id);
    setAvailability(newAvail);
    setIsUpdating(false);
    setShowEditAvailability(false);
  };

  const renderAvailability = () => (
    <div className="sm-text-center">
      {availability &&
        availability.map((avail, i) => (
          <div key={i} className="my-2">
            <p className="my-1">
              <strong>{avail.day}</strong>
            </p>
            <p>
              {avail.start_time} - {avail.end_time}
            </p>
          </div>
        ))}
      <button
        className="btn-sm btn-hovered mt-3"
        onClick={handleShowEditAvailability}
      >
        Edit
      </button>
    </div>
  );

  const renderEditAvailability = () => (
    <div className="w-50 sm-w-100">
      {days.map(({ day, dayStart, dayEnd, setDayStart, setDayEnd }, i) => (
        <div key={i}>
          <EditAvailability
            day={day}
            dayStart={dayStart}
            dayEnd={dayEnd}
            setDayStart={setDayStart}
            setDayEnd={setDayEnd}
            times={times}
            store={store}
          />
        </div>
      ))}

      <div className="w-50 sm-w-80 mt-5 text-center sm-x-center">
        <button
          className={`btn-sm m-2 ${!isUpdating && "btn-hovered"}`}
          disabled={isUpdating}
          onClick={() => handleSaveAvailability()}
        >
          Save
        </button>
        <button
          className={`btn-sm m-2 ${!isUpdating && "btn-hovered"}`}
          disabled={isUpdating}
          onClick={() => setShowEditAvailability(false)}
        >
          Cancel
        </button>
      </div>

      {isUpdating && (
        <div className="w-50 sm-w-80 my-1 text-center sm-x-center">
          <Loader type="ThreeDots" height={10} color="rgb(50, 110, 150)" />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (verifiedUser) {
        const availability = await getUserAvailability(verifiedUser.u_id);
        const times = await getTimes();
        const store = await getStoreHours();

        if (isMounted) {
          setAvailability(availability);
          setTimes(times);
          setStore(store);
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => (isMounted = false);
  }, [verifiedUser]);

  return (
    <>
      {isLoading ? (
        <div className="text-center" style={{ marginTop: "70px" }}>
          <Loader type="Oval" color="rgb(50, 110, 150)" />
        </div>
      ) : (
        <div className="availability-container">
          {showEditAvailability
            ? renderEditAvailability()
            : renderAvailability()}
        </div>
      )}
    </>
  );
}

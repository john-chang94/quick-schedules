import React, { useReducer } from "react";
import { isAuthenticated } from "../../../services/auth";
import {
  getStoreHours,
  setStoreHours,
  updateStoreHours,
} from "../../../services/store";

import { Spinner } from "../../../components/Spinner";

export const StoreHours = ({ times, store, storeFirstTime, setStore }) => {
  const initialState = {
    store: {},
    showEditHours: false,
    isUpdating: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SHOW_EDIT":
        return {
          ...state,
          store, // Set entire fetched store object in state as store
          showEditHours: true,
        };
      case "SELECT_STORE_OPEN":
        return {
          ...state,
          store: { // Only update store open values (time, value, level)
            ...state.store,
            store_open: action.payload.time,
            store_open_value: action.payload.value,
            store_open_level: action.payload.level,
          },
        };
      case "SELECT_STORE_CLOSE":
        return {
          ...state,
          store: { // Only update store close values (time, value, level)
            ...state.store,
            store_close: action.payload.time,
            store_close_value: action.payload.value,
            store_close_level: action.payload.level,
          },
        };
      case "HIDE_EDIT":
        return { ...state, showEditHours: false };
      case "TOGGLE_IS_UPDATING":
        return { ...state, isUpdating: !state.isUpdating };
      case "UPDATE_SUCCESS":
        return {
          ...state,
          showEditHours: false,
          isUpdating: !state.isUpdating,
        };
      case "RESET":
        return initialState;
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSetStoreHours = async () => {
    const tokenConfig = isAuthenticated();
    dispatch({ type: "TOGGLE_IS_UPDATING" });

    // Set store hours if first time
    if (storeFirstTime) await setStoreHours(state.store, tokenConfig);
    // Otherwise, update store hours
    else await updateStoreHours(state.store, tokenConfig);

    const store = await getStoreHours();
    setStore(store);
    dispatch({ type: "UPDATE_SUCCESS" });
  };

  const handleSelectStoreOpen = (store_open_value) => {
    for (let i = 0; i < times.length; i++) {
      if (times[i].time === store_open_value) {
        dispatch({
          type: "SELECT_STORE_OPEN",
          payload: {
            time: times[i].time,
            value: times[i].value,
            level: times[i].level,
          },
        });
      }
    }
  };

  const handleSelectStoreClose = (store_close_value) => {
    for (let i = 0; i < times.length; i++) {
      if (times[i].time === store_close_value) {
        dispatch({
            type: "SELECT_STORE_CLOSE",
            payload: {
              time: times[i].time,
              value: times[i].value,
              level: times[i].level,
            },
          });
      }
    }
  };

  return (
    <>
      <h3 className="my-2">Store Hours</h3>
      {state.showEditHours ? ( // Render edit hours component
        <>
          <div className="my-1">
            <p>Open</p>
            <select
              value={state.store.store_open}
              onChange={({ target }) => handleSelectStoreOpen(target.value)}
            >
              {times &&
                times.map((time, i) => (
                  <option key={i} value={time.time}>
                    {time.time}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-1">
            <p>Close</p>
            <select
              value={state.store.store_close}
              onChange={({ target }) => handleSelectStoreClose(target.value)}
            >
              {times &&
                times.map((time, i) => (
                  <option key={i} value={time.time}>
                    {time.time}
                  </option>
                ))}
            </select>
          </div>
          <div className="text-center">
            <button
              className={`m-2 btn-sm ${!state.isUpdating && "btn-hovered"}`}
              disabled={state.isUpdating}
              onClick={handleSetStoreHours}
            >
              Save
            </button>
            <button
              className={`m-2 btn-sm ${!state.isUpdating && "btn-hovered"}`}
              disabled={state.isUpdating}
              onClick={() => dispatch({ type: "HIDE_EDIT" })}
            >
              Cancel
            </button>
          </div>
          {state.isUpdating && <Spinner />}
        </>
      ) : (
        // Render store hours
        <>
          {store.store_open && store.store_close ? (
            <p className="my-2">
              {store.store_open.toString()} - {store.store_close.toString()}
            </p>
          ) : (
            // Render N/A if store's first time setting hours
            <p className="my-2">N/A</p>
          )}
          <button
            className="btn-md btn-hovered mt-1 mb-2"
            onClick={() => dispatch({ type: "SHOW_EDIT" })}
          >
            Edit
          </button>
        </>
      )}
    </>
  );
};

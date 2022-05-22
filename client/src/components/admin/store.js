import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import {
  getStoreHours,
  setStoreHours,
  updateStoreHours,
} from "../../services/store";
import { deletePreset, getPresets } from "../../services/presets";
import { getTimes } from "../../services/store";
import { isAuthenticated } from "../../services/auth";

export default function AdminStore() {
  const [isLoading, setIsLoading] = useState(true);
  const [times, setTimes] = useState(null);
  const [presets, setPresets] = useState(null);
  const [store, setStore] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSettingStoreHours, setIsSettingStoreHours] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const [store_open, setStoreOpen] = useState("");
  const [store_close, setStoreClose] = useState("");
  const [store_open_value, setStoreOpenValue] = useState("");
  const [store_close_value, setStoreCloseValue] = useState("");
  const [store_open_level, setStoreOpenLevel] = useState("");
  const [store_close_level, setStoreCloseLevel] = useState("");
  const [showEditHours, setShowEditHours] = useState(false);
  const [storeFirstTime, setStoreFirstTime] = useState(null);

  // Set store hours for the first time
  const handleSetStoreHours = async () => {
    const tokenConfig = isAuthenticated();
    setIsSettingStoreHours(true);

    const body = {
      store_open,
      store_close,
      store_open_value,
      store_close_value,
      store_open_level,
      store_close_level,
    };

    await setStoreHours(body, tokenConfig);
    await getStoreHours();
    setIsSettingStoreHours(false);
    setShowEditHours(false);
  };

  // Update store hours
  const handleUpdateStoreHours = async () => {
    const tokenConfig = isAuthenticated();
    setIsSettingStoreHours(true);

    const body = {
      store_open,
      store_close,
      store_open_value,
      store_close_value,
      store_open_level,
      store_close_level,
    };

    await updateStoreHours(body, tokenConfig);
    await getStoreHours();
    setIsSettingStoreHours(false);
    setShowEditHours(false);
  };

  const handleSelectStoreOpen = (store_open) => {
    console.log(store_open);
    for (let i = 0; i < times.length; i++) {
      if (times[i].time === store_open) {
        setStoreOpen(times[i].time);
        setStoreOpenValue(times[i].value);
        setStoreOpenLevel(parseFloat(times[i].level));
      }
    }
  };

  const handleSelectStoreClose = (store_close) => {
    for (let i = 0; i < times.length; i++) {
      if (times[i].time === store_close) {
        setStoreClose(times[i].time);
        setStoreCloseValue(times[i].value);
        setStoreCloseLevel(parseFloat(times[i].level));
      }
    }
  };

  const handleDeletePreset = async (p_id) => {
    const doDelete = window.confirm("Delete preset?");
    if (doDelete) {
      setIsUpdating(true);
      setUpdatingId(p_id);

      const tokenConfig = isAuthenticated();
      await deletePreset(p_id, tokenConfig);
      const presets = await getPresets();

      setPresets(presets);
      setIsUpdating(false);
      setUpdatingId("");
    }
  };

  // Reset store hours in view if user cancels editing
  const handleCancelEdit = () => {
    setStoreOpen(store.store_open);
    setStoreClose(store.store_close);
    setShowEditHours(false);
  };

  const renderStoreHours = () =>
    showEditHours ? ( // Render edit hours component
      <>
        <div className="my-1">
          <p>Open</p>
          <select
            value={store_open}
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
            value={store_close}
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
            className={`m-2 btn-sm ${!isSettingStoreHours && "btn-hovered"}`}
            disabled={isSettingStoreHours}
            onClick={() =>
              // Set store hours if first time, otherwise update
              storeFirstTime === true
                ? handleSetStoreHours()
                : handleUpdateStoreHours()
            }
          >
            Save
          </button>
          <button
            className={`m-2 btn-sm ${!isSettingStoreHours && "btn-hovered"}`}
            disabled={isSettingStoreHours}
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </div>
        {isSettingStoreHours && (
          <div className="text-center">
            <Loader type="ThreeDots" height={10} color="rgb(50, 110, 150)" />
          </div>
        )}
      </>
    ) : (
      // Render store hours
      <>
        {store_open && store_close ? (
          <p className="my-2">
            {store_open.toString()} - {store_close.toString()}
          </p>
        ) : (
          // Render N/A if store's first time setting hours
          <p className="my-2">N/A</p>
        )}
        <button
          className="btn-md btn-hovered mt-1 mb-2"
          onClick={() => setShowEditHours(true)}
        >
          Edit
        </button>
      </>
    );

  const renderPresets = () => (
    <>
      <h3 className="my-2">Manage presets</h3>
      {presets &&
        presets.map((preset, i) =>
          isUpdating && updatingId === preset.p_id ? (
            <div className="text-center" key={i}>
              <Loader type="Oval" color="rgb(50, 110, 150)" height={20} />
            </div>
          ) : (
            <div key={i}>
              <div className="border-solid-1 p-1 flex justify-between">
                <p>
                  {preset.shift_start} - {preset.shift_end}
                </p>
                <p
                  className="pointer light-blue-darken-4"
                  onClick={() => handleDeletePreset(preset.p_id)}
                >
                  <i className="fas fa-trash-alt" />
                </p>
              </div>
            </div>
          )
        )}
    </>
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const times = await getTimes();
      const presets = await getPresets();
      const store = await getStoreHours();

      // Set fetched data
      if (times && presets && isMounted) {
        setTimes(times);
        setPresets(presets);
        // Set store hours if it exists in db (if not first time)
        if (isMounted) {
          setStore(store);
          setStoreOpen(store.store_open);
          setStoreClose(store.store_close);
          setStoreOpenValue(store.store_open_value);
          setStoreCloseValue(store.store_close_value);
          setStoreOpenLevel(store.store_open_level);
          setStoreCloseLevel(store.store_close_level);
          setStoreFirstTime(false);
        } else {
          // Otherwise set first time to true
          // This will determine what the save button does
          setStoreFirstTime(true);
        }
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
        <div className="store p-1">
          <h3 className="my-2">Store Hours</h3>
          {renderStoreHours()}
          <hr className="my-3" />
          {renderPresets()}
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { getStoreHours } from "../../../services/store";
import { getPresets } from "../../../services/presets";
import { getTimes } from "../../../services/store";

import { StoreHours } from "./StoreHours";
import { StorePresets } from "./StorePresets";
import { Spinner } from "../../../components/Spinner";

export default function AdminStore() {
  const [isLoading, setIsLoading] = useState(true);
  const [times, setTimes] = useState([]);
  const [presets, setPresets] = useState([]);
  const [store, setStore] = useState(null);
  const [storeFirstTime, setStoreFirstTime] = useState(null);

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
        if (isMounted) {
          // Set store hours if it exists in db (if not first time)
          if (store) {
            setStore(store);
            setStoreFirstTime(false);
          } else {
            // Otherwise set first time to true
            // This will determine what the save button does
            setStoreFirstTime(true);
          }
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
        <Spinner />
      ) : (
        <div className="store p-1">
          <StoreHours
            store={store}
            times={times}
            storeFirstTime={storeFirstTime}
            setStore={setStore}
          />
          <hr className="my-3" />
          <StorePresets presets={presets} setPresets={setPresets} />
        </div>
      )}
    </>
  );
}

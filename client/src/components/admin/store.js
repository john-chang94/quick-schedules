import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Loader from 'react-loader-spinner';
import { fetchStoreHours, setStoreHours, updateStoreHours } from '../../services/store';
import { fetchPresets, fetchTimes } from '../../services/presets';
import { isAuthenticated } from '../../services/auth';

export default function AdminStore() {
    const [isLoading, setIsLoading] = useState(true);
    const [times, setTimes] = useState(null);
    const [presets, setPresets] = useState(null);

    const [store_open, setStoreOpen] = useState('');
    const [store_close, setStoreClose] = useState('');
    const [store_open_value, setStoreOpenValue] = useState('');
    const [store_close_value, setStoreCloseValue] = useState('');
    const [store_open_level, setStoreOpenLevel] = useState('');
    const [store_close_level, setStoreCloseLevel] = useState('');
    const [showEditHours, setShowEditHours] = useState(false);
    const [storeFirstTime, setStoreFirstTime] = useState(null);

    const handleSetStoreHours = async () => {
        const tokenConfig = isAuthenticated();

        setTimeout(() => {
            async function saveData() {
                const body = { store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level };

                await setStoreHours(body, tokenConfig);
                await fetchStoreHours();
            }

            saveData();
        }, 700);

    }

    const handleUpdateStoreHours = async () => {
        const tokenConfig = isAuthenticated();

        setTimeout(() => {
            async function saveData() {
                const body = { store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level };

                await updateStoreHours(body, tokenConfig);
                await fetchStoreHours();
            }

            saveData();
        }, 700);
    }

    const handleSelectStoreOpen = (store_open) => {
        for (let i = 0; i < times.length; i++) {
            if (times[i].time === store_open) {
                setStoreOpen(times[i].time);
                setStoreOpenValue(times[i].value);
                setStoreOpenLevel(parseFloat(times[i].level));
            }
        }
    }

    const handleSelectStoreClose = (store_close) => {
        for (let i = 0; i < times.length; i++) {
            if (times[i].time === store_close) {
                setStoreClose(times[i].time);
                setStoreCloseValue(times[i].value);
                setStoreCloseLevel(parseFloat(times[i].level));
            }
        }
    }

    useEffect(() => {
        async function getData() {
            const times = await fetchTimes();
            const presets = await fetchPresets();
            const store = await fetchStoreHours();

            setTimes(times);
            setPresets(presets);

            if (store) {
                setStoreOpen(store.store_open);
                setStoreClose(store.store_close);
                setStoreOpenValue(store.store_open_value);
                setStoreCloseValue(store.store_close_value);
                setStoreOpenLevel(store.store_open_level);
                setStoreCloseLevel(store.store_close_level);
                setStoreFirstTime(false);
            } else {
                setStoreFirstTime(true);
            }

            setIsLoading(false);
        }

        getData();
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>

            <div className="mt-4">
                {
                    isLoading
                        ? <div className="text-center" style={{ marginTop: '70px' }}>
                            <Loader
                                type='Oval'
                                color='rgb(50, 110, 150)'
                            />
                        </div>
                        : <div className="flex justify-center">
                            <div className="text-center border-solid-1 border-smooth box-shadow w-50 med-w-70 sm-w-80 xs-w-90">
                                <h3 className="my-1">Store Hours</h3>
                                {
                                    showEditHours
                                        ? <div className="flex flex-col align-center">
                                            <div className="my-1">
                                                <p>Open</p>
                                                <select
                                                    className="w-3"
                                                    value={store_open}
                                                    onChange={({ target }) => handleSelectStoreOpen(target.value)}
                                                >
                                                    {
                                                        times && times.map((time, i) => (
                                                            <option key={i} value={time.time}>{time.time}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="my-1">
                                                <p>Close</p>
                                                <select
                                                    className="w-3"
                                                    value={store_close}
                                                    onChange={({ target }) => handleSelectStoreClose(target.value)}
                                                >
                                                    {
                                                        times && times.map((time, i) => (
                                                            <option key={i} value={time.time}>{time.time}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="my-3 w-4 flex justify-evenly">
                                                <button className="btn-sm" onClick={() => storeFirstTime === true ? handleSetStoreHours() : handleUpdateStoreHours()}>Save</button>
                                                <button className="btn-sm" onClick={() => setShowEditHours(false)}>Cancel</button>
                                            </div>
                                        </div>
                                        : <div>
                                            {
                                                store_open && store_close
                                                    ? <p className="my-2">{store_open.toString()} - {store_close.toString()}</p>
                                                    : <p className="my-2">N/A</p>
                                            }
                                            <button className="btn-med mt-1 mb-3" onClick={() => setShowEditHours(true)}>Edit</button>
                                        </div>
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
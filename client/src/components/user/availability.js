import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { UserContext } from '../../contexts/userContext';
import { isAuthenticated } from '../../services/auth';
import Loader from 'react-loader-spinner';
import { editUserAvailability, fetchUserAvailability } from '../../services/users';
import { fetchTimes } from '../../services/presets';

export default function UserAvailability() {
    const { verifiedUser } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showEditAvailability, setShowEditAvailability] = useState(false);

    const [availability, setAvailability] = useState(null);
    const [times, setTimes] = useState(null);

    const [monStart, setMonStart] = useState('');
    const [monEnd, setMonEnd] = useState('');
    const [tueStart, setTueStart] = useState('');
    const [tueEnd, setTueEnd] = useState('');
    const [wedStart, setWedStart] = useState('');
    const [wedEnd, setWedEnd] = useState('');
    const [thurStart, setThurStart] = useState('');
    const [thurEnd, setThurEnd] = useState('');
    const [friStart, setFriStart] = useState('');
    const [friEnd, setFriEnd] = useState('');
    const [satStart, setSatStart] = useState('');
    const [satEnd, setSatEnd] = useState('');
    const [sunStart, setSunStart] = useState('');
    const [sunEnd, setSunEnd] = useState('');

    const handleShowEditAvailability = () => {
        for (let i = 0; i < availability.length; i++) {
            switch (availability[i].day) {
                case 'Monday':
                    setMonStart(availability[i].start_time);
                    setMonEnd(availability[i].end_time);
                    break;
                case 'Tuesday':
                    setTueStart(availability[i].start_time);
                    setTueEnd(availability[i].end_time);
                    break;
                case 'Wednesday':
                    setWedStart(availability[i].start_time);
                    setWedEnd(availability[i].end_time);
                    break;
                case 'Thursday':
                    setThurStart(availability[i].start_time);
                    setThurEnd(availability[i].end_time);
                    break;
                case 'Friday':
                    setFriStart(availability[i].start_time);
                    setFriEnd(availability[i].end_time);
                    break;
                case 'Saturday':
                    setSatStart(availability[i].start_time);
                    setSatEnd(availability[i].end_time);
                    break;
                case 'Sunday':
                    setSunStart(availability[i].start_time);
                    setSunEnd(availability[i].end_time);
                    break;
                default:
                    return;
            }
        }

        setShowEditAvailability(true);
    }

    const handleSaveAvailability = async () => {
        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        let data = [];

        let mon = { u_id: verifiedUser.u_id, day: availability[0].day, start_time: monStart, end_time: monEnd, level: 1 };
        data.push(mon);
        let tue = { u_id: verifiedUser.u_id, day: availability[1].day, start_time: tueStart, end_time: tueEnd, level: 2 };
        data.push(tue);
        let wed = { u_id: verifiedUser.u_id, day: availability[2].day, start_time: wedStart, end_time: wedEnd, level: 3 };
        data.push(wed);
        let thur = { u_id: verifiedUser.u_id, day: availability[3].day, start_time: thurStart, end_time: thurEnd, level: 4 };
        data.push(thur);
        let fri = { u_id: verifiedUser.u_id, day: availability[4].day, start_time: friStart, end_time: friEnd, level: 5 };
        data.push(fri);
        let sat = { u_id: verifiedUser.u_id, day: availability[5].day, start_time: satStart, end_time: satEnd, level: 6 };
        data.push(sat);
        let sun = { u_id: verifiedUser.u_id, day: availability[6].day, start_time: sunStart, end_time: sunEnd, level: 7 };
        data.push(sun);

        // Check if N/A is paired with a time value
        for (let i = 0; i < data.length; i++) {
            if ((data[i].start_time === 'N/A' && data[i].end_time !== 'N/A') ||
                (data[i].start_time !== 'N/A' && data[i].end_time === 'N/A')) {
                setIsUpdating(false);
                return alert('N/A must only be N/A');
            }
        }

        for (let i = 0; i < data.length; i++) {
            await editUserAvailability(availability[i].a_id, data[i], tokenConfig);
        }

        const newAvail = await fetchUserAvailability(verifiedUser.u_id);
        setAvailability(newAvail);
        setIsUpdating(false);
        setShowEditAvailability(false);
    }

    const renderAvailability = () => (
        <div className="flex flex-col align-center mt-4">
            <div className="border-solid-1 border-smooth w-50 lg-w-60 med-w-80 xs-w-90">
                <div>
                    {
                        availability && availability.map((avail, i) => (
                            <div key={i} className="text-center my-2">
                                <p className="my-1"><strong>{avail.day}</strong></p>
                                <p>{avail.start_time} - {avail.end_time}</p>
                            </div>
                        ))
                    }
                </div>
                <div className="text-center my-5">
                    <button className="btn-sm btn-hovered" onClick={handleShowEditAvailability}>Edit</button>
                </div>
            </div>
        </div>
    )

    const renderEditAvailability = () => (
        <div className="flex justify-center mt-4">
            <div className="border-solid-1 border-smooth w-50 lg-w-60 med-w-80 xs-w-90">
                <div className="flex flex-col text-center">

                    <p className="mt-2">Monday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={monStart} onChange={({ target }) => setMonStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={monEnd} onChange={({ target }) => setMonEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Tuesday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={tueStart} onChange={({ target }) => setTueStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={tueEnd} onChange={({ target }) => setTueEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Wednesday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={wedStart} onChange={({ target }) => setWedStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={wedEnd} onChange={({ target }) => setWedEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Thursday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={thurStart} onChange={({ target }) => setThurStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={thurEnd} onChange={({ target }) => setThurEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Friday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={friStart} onChange={({ target }) => setFriStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={friEnd} onChange={({ target }) => setFriEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Saturday</p>
                    <div className="flex justify-center justify-evenly">
                        <div>
                            <p>From</p>
                            <select value={satStart} onChange={({ target }) => setSatStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={satEnd} onChange={({ target }) => setSatStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <p className="mt-3">Sunday</p>
                    <div className="flex justify-center justify-evenly mb-2">
                        <div>
                            <p>From</p>
                            <select value={sunStart} onChange={({ target }) => setSunStart(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <p>To</p>
                            <select value={sunEnd} onChange={({ target }) => setSunEnd(target.value)}>
                                <option value="ANY">ANY</option>
                                <option value="N/A">N/A</option>
                                {
                                    times && times.map((time, i) => (
                                        <option key={i} value={time.time}>{time.time}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="my-2">
                        <button
                            className={`btn-sm mx-3 ${!isUpdating && 'btn-hovered'}`}
                            disabled={isUpdating}
                            onClick={() => handleSaveAvailability()}
                        >
                            Save
                        </button>
                        <button className={`btn-sm mx-3 ${!isUpdating && 'btn-hovered'}`} disabled={isUpdating} onClick={() => setShowEditAvailability(false)}>Cancel</button>
                    </div>

                    {
                        isUpdating &&
                        <div className="text-center my-1">
                            <Loader
                                type='ThreeDots'
                                height={10}
                                color='rgb(50, 110, 150)'
                            />
                        </div>
                    }

                </div>
            </div>
        </div>
    )

    useEffect(() => {
        async function getData() {
            if (verifiedUser) {
                const availability = await fetchUserAvailability(verifiedUser.u_id);
                const times = await fetchTimes();

                setAvailability(availability);
                setTimes(times);
                setIsLoading(false);
                console.log(`availability`, availability)
            }
        }

        getData();
    }, [verifiedUser])

    return (
        <div>
            <div>
                <Link to={ROUTES.USER_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>
            {
                isLoading
                    ? <div className="text-center" style={{ marginTop: '70px' }}>
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div>
                    : <>
                        {
                            showEditAvailability
                                ? renderEditAvailability()
                                : renderAvailability()
                        }
                    </>
            }
        </div>
    )
}
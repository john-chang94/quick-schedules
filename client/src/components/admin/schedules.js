import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import { fetchTimes } from '../../services/presets';
import { createShift } from '../../services/shifts';
import { fetchAllUsersSchedulesByDate, fetchAllUsersAndAvailabilities } from '../../services/users';

export default function AdminSchedules() {
    const [users, setUsers] = useState(null);
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState(null);

    const [date, setDate] = useState(null);

    const [shiftStart, setShiftStart] = useState('0 0');
    const [shiftEnd, setShiftEnd] = useState('0 0');

    // Used to render edit shift mode for clicked date and employee only
    const [userData, setUserData] = useState(null);
    const [availabilityIndex, setAvailabilityIndex] = useState(null);

    const getFirstAndLastDatesOfCurrentWeek = () => {
        let date = new Date();
        // Get Monday of the week, getDate returns 1-31, getDay returns 0-6
        let mondayOfTheWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        // Assign date for Monday of the week to firstDate, setDate requires 1-31
        let firstDate = new Date(date.setDate(mondayOfTheWeek));
        let lastDate = new Date(date.setDate(mondayOfTheWeek + 6))

    }

    const handleSaveShift = async (u_id, dayIndex) => {
        const tokenConfig = isAuthenticated();
        // Get shift date
        const date = days[dayIndex];
        // Get hour and minute in INT data type for date object
        const startTimeHour = parseInt(shiftStart.split(' ')[0]);
        const startTimeMinute = parseInt(shiftStart.split(' ')[1]);
        // Get hour and minute in INT data type for date object
        const endTimeHour = parseInt(shiftEnd.split(' ')[0]);
        const endTimeMinute = parseInt(shiftEnd.split(' ')[1]);
        // Get local timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        // Create new date objects with year, month, day, hour, minute
        const shift_start = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTimeHour,
            startTimeMinute).toLocaleString('en-US', { timeZone: timezone });

        const shift_end = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTimeHour,
            endTimeMinute).toLocaleString('en-US', { timeZone: timezone });

        const body = { u_id, shift_start, shift_end };
        const res = await createShift(body, tokenConfig);
    }

    // const handle

    const handleUserClick = (u_id, index) => {
        setUserData(u_id);
        setAvailabilityIndex(index);
    }

    const renderEditShift = (u_id, dayIndex) => (
        <td key={dayIndex}>
            <p className="text-3">Shift start</p>
            <select className="w-90" defaultValue={times[0].value} onChange={({ target }) => setShiftStart(target.value)}>
                {
                    times && times.map((time, i) => (
                        <option key={i} value={time.value}>
                            {time.time}
                        </option>
                    ))
                }
            </select>
            <p className="text-3">Shift end</p>
            <select className="w-90" defaultValue={times[0].value} onChange={({ target }) => setShiftEnd(target.value)}>
                {
                    times && times.map((time, i) => (
                        <option key={i} value={time.value}>
                            {time.time}
                        </option>
                    ))
                }
            </select>
            <div className="mx-2 w-100 flex justify-evenly">
                <button className="btn-x-sm btn-hovered bg-gray off-white" onClick={() => handleSaveShift(u_id, dayIndex)}>
                    <i className="fas fa-check"></i>
                </button>
                <button className="btn-x-sm btn-hovered bg-gray off-white">
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>
    )

    useEffect(() => {
        async function getData() {
            const times = await fetchTimes();
            setTimes(times);
        }

        getData();
    }, [])

    // Get dates for the week (Mon - Sun) based on the current day
    useEffect(() => {
        async function getDatesAndLoadData() {
            const tokenConfig = isAuthenticated();
            // Current date
            let date = new Date();
            // Get Monday of the week, getDate returns 1-31, getDay returns 0-6
            let mondayOfTheWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
            // Assign date for Monday of the week to firstDate, setDate requires 1-31
            let firstDate = new Date(date.setDate(mondayOfTheWeek));
            let lastDate = new Date(date.setDate(mondayOfTheWeek + 6))
            let daysArray = []

            for (let i = 0; i < 7; i++) {
                // Starting on Monday, add 0-6 each loop to increment the date
                // then turn into a date object to add to array
                let day = new Date(date.setDate(firstDate.getDate() + i));
                daysArray.push(day);
            }

            const startDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()).toISOString().split('T')[0];
            const endDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).toISOString().split('T')[0];

            const users = await fetchAllUsersSchedulesByDate(startDate, endDate, tokenConfig);

            setDays(daysArray);
            setUsers(users);
            console.log(`users`, users)
        }

        getDatesAndLoadData();
    }, [])

    return (
        <div>
            <div>
                <Link to={ROUTES.ADMIN_HOME} className="text-no-u black pointer">
                    <i className="fas fa-arrow-left"></i> Home
                </Link>
            </div>

            <div>
                <h3 className="text-center">Availability</h3>
                <table id="availability-table" style={{ tableLayout: 'fixed' }} className="border-collapse w-100 text-center">
                    <thead>
                        <tr className="border-bottom">
                            <th className="text-vw p-2">Role</th>
                            <th className="text-vw p-2">Name</th>
                            {
                                // Render the day only
                                days && days.map((day, i) => (
                                    <th key={i} className="text-vw p-2">
                                        <p>{day.toString().split(' ')[0]}</p>
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users && users.map((user, i) => (
                                <tr
                                    key={i}
                                    className="border-bottom"
                                    style={i % 2 === 0
                                        ? { backgroundColor: 'rgb(235, 235, 235)' }
                                        : { backgroundColor: 'rbg(255, 255, 255)' }}
                                >
                                    <td className="text-vw nowrap px-1">{user.title}</td>
                                    <td className="text-vw nowrap px-1">{user.first_name} {user.last_name}</td>
                                    {
                                        user.availability.map((time, i) => (
                                            <td key={i} className={`text-vw nowrap px-1 ${time === 'NA' && 'bg-black'}`}>{time}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="mt-5">
                <table style={{ tableLayout: 'fixed' }} className="w-100 border-collapse text-center">
                    <tbody>
                        <tr className="border-bottom">
                            <td className="text-vw"><strong>Role</strong></td>
                            <td className="text-vw"><strong>Name</strong></td>
                            {
                                days && days.map((day, i) => (
                                    <td className="text-vw" key={i}>
                                        <strong>{day.toString().split(' ')[0]}</strong>
                                        <p><em>{day.toLocaleDateString()}</em></p>
                                    </td>
                                ))
                            }
                        </tr>
                        {
                            users && users.map((user, u_i) => (
                                <tr
                                    key={u_i}
                                    className="bg-x-light-gray border-bottom h-10"
                                >
                                    <td className="border-y text-vw nowrap">{user.title}</td>
                                    <td className="border-y text-vw nowrap">{user.first_name} {user.last_name}</td>
                                    {
                                        user.availability.map((time, a_i) => {
                                            return (
                                                // Only render edit mode for clicked date and employee
                                                (userData === user.u_id && availabilityIndex === a_i)
                                                    ? renderEditShift(user.u_id, a_i)
                                                    : <td
                                                        key={a_i}
                                                        className={ // Keep bg color black if employee is 'NA' for schedule
                                                            `border-y text-vw nowrap pointer
                                                                ${time === 'NA' ? 'bg-black' : 'bg-light-gray-hovered'}`
                                                        }
                                                        onClick={() => handleUserClick(user.u_id, a_i)}
                                                    >
                                                        {
                                                            (user.shifts[a_i] !== undefined)
                                                                ? <p>
                                                                    {new Date(user.shifts[a_i].shift_start).toLocaleTimeString().replace(':00 ', ' ')} -&nbsp;
                                                                    {new Date(user.shifts[a_i].shift_end).toLocaleTimeString().replace(':00 ', ' ')}
                                                                </p>
                                                                : null
                                                        }
                                                    </td>
                                            )
                                        })
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
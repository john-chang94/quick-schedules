import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { isAuthenticated } from '../../services/auth';
import { fetchTimes } from '../../services/presets';
import { createShift, fetchAllUsersSchedulesByDate, deleteShift, updateShift } from '../../services/shifts';
import { fetchAllUsersAvailabilities } from '../../services/users';
import Loader from 'react-loader-spinner';

export default function AdminSchedules() {
    const [availabilities, setAvailabilities] = useState([]);
    const [users, setUsers] = useState(null);
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [date, setDate] = useState(null);
    // Used for fetching data within dates in ISO string
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [shiftStart, setShiftStart] = useState('0 0');
    const [shiftEnd, setShiftEnd] = useState('0 0');

    // Used to render edit shift mode for selected date and employee only
    const [userData, setUserData] = useState(null);
    const [availabilityIndex, setAvailabilityIndex] = useState(null);

    // Can create or update shift based on s_id being provided
    const handleSaveShift = async (u_id, dayIndex, s_id) => {
        setIsUpdating(true);
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
        // Create new date objects with year, month, day, hour, minute, and timezone
        const shift_start = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTimeHour,
            startTimeMinute)
            .toLocaleString('en-US', { timeZone: timezone });

        const shift_end = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTimeHour,
            endTimeMinute)
            .toLocaleString('en-US', { timeZone: timezone });

        const body = { u_id, shift_start, shift_end };
        if (s_id) {
            await updateShift(s_id, body, tokenConfig);
        } else {
            await createShift(body, tokenConfig);
        }

        const users = await fetchAllUsersSchedulesByDate(startDate, endDate);
        setUsers(users);

        setUserData('');
        setAvailabilityIndex('');
        setIsUpdating(false);
    }

    const handleCancelShift = () => {
        setUserData('');
        setAvailabilityIndex('');
    }

    const handleUserClick = (u_id, index) => {
        setUserData(u_id);
        setAvailabilityIndex(index);
        setShiftStart('0 0');
        setShiftEnd('0 0');
    }

    const handleEditShift = (u_id, index, startTimeValue, endTimeValue) => {
        setUserData(u_id);
        setAvailabilityIndex(index);
        setShiftStart(startTimeValue);
        setShiftEnd(endTimeValue);
    }

    const handleRemoveShift = async (s_id) => {
        const toDelete = window.confirm('Are you sure you want to remove this shift?');
        if (toDelete) {
            const tokenConfig = isAuthenticated();
            setIsUpdating(true);
            await deleteShift(s_id, tokenConfig);

            const users = await fetchAllUsersSchedulesByDate(startDate, endDate);
            setUsers(users);
            setUserData('');
            setAvailabilityIndex('');
            setIsUpdating(false);
        }
    }

    const getTimeValue = (shift) => {
        const date = new Date(shift);
        const hour = date.getHours();
        const min = date.getMinutes();
        const values = `${hour.toString()} ${min.toString()}`
        return values;
    }

    const getTime = (shift) => {
        return new Date(shift).toLocaleTimeString().replace(':00 ', ' ');
    }

    const renderEditShift = (u_id, dayIndex, shift) => (
        <td key={dayIndex}>
            <p className="text-3">Shift start</p>
            <select
                className="w-80"
                defaultValue={shiftStart}
                disabled={isUpdating}
                onChange={({ target }) => setShiftStart(target.value)}>
                {
                    times && times.map((time, i) => (
                        <option key={i} value={time.value}>
                            {time.time}
                        </option>
                    ))
                }
            </select>
            <p className="text-3">Shift end</p>
            <select
                className="w-80"
                defaultValue={shiftEnd}
                disabled={isUpdating}
                onChange={({ target }) => setShiftEnd(target.value)}>
                {
                    times && times.map((time, i) => (
                        <option key={i} value={time.value}>
                            {time.time}
                        </option>
                    ))
                }
            </select>
            {
                isUpdating ?
                    <div className="mx-1">
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                            height={35}
                        />
                    </div> :
                    <div className="mx-2 w-100 flex justify-evenly">
                        <button
                            className="btn-x-sm btn-hovered bg-dark-gray off-white"
                            onClick={() => handleSaveShift(u_id, dayIndex, shift.s_id)}
                        >
                            <i className="fas fa-check"></i>
                        </button>
                        <button
                            className="btn-x-sm btn-hovered bg-dark-gray off-white"
                            onClick={() => shift.s_id ? handleRemoveShift(shift.s_id) : handleCancelShift()}
                        >
                            {
                                shift.shift_end === null
                                    ? <i className="fas fa-times"></i>
                                    : <i className="fas fa-trash-alt"></i>
                            }
                        </button>
                    </div>
            }
        </td>
    )

    const renderBlank = (u_id, a_i, time) => (
        <td
            key={a_i}
            // Keep bg color black if employee is 'NA' for availability
            className={`border-y text-vw nowrap pointer h-10 ${time === 'NA' ? 'bg-black' : 'bg-light-gray-hovered'}`}
            onClick={() => handleUserClick(u_id, a_i)}
        ></td>
    )

    const renderShift = (u_id, a_i, shift_start, shift_end) => (
        <td
            key={a_i}
            className="border-y text-vw nowrap pointer h-10 bg-light-gray-hovered"
            onClick={() => handleEditShift(u_id, a_i, getTimeValue(shift_start), getTimeValue(shift_end))}
        >
            {getTime(shift_start)} -&nbsp;
            {getTime(shift_end)}
        </td>
    )

    useEffect(() => {
        async function getData() {
            const times = await fetchTimes();
            const availabilities = await fetchAllUsersAvailabilities();
            setTimes(times);
            setAvailabilities(availabilities);
        }

        getData();
    }, [])

    // Get dates for the week (Mon - Sun) based on the current day
    useEffect(() => {
        async function getDatesAndLoadData() {
            // Current date
            const date = new Date();
            // Get Monday of the week, getDate returns 1-31, getDay returns 0-6
            const mondayOfTheWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
            // Assign date for Monday of the week to firstDate, setDate requires 1-31
            const firstDate = new Date(date.setDate(mondayOfTheWeek));
            const lastDate = new Date(date.setDate(mondayOfTheWeek + 6))
            let daysArray = []

            for (let i = 0; i < 7; i++) {
                // Starting on Monday, add 0-6 each loop to increment the date
                // then turn into a date object to add to array
                let day = new Date(date.setDate(firstDate.getDate() + i));
                daysArray.push(day);
            }

            const startDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()).toISOString();
            const endDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).toISOString();

            const users = await fetchAllUsersSchedulesByDate(startDate, endDate);

            setDays(daysArray);
            setStartDate(startDate);
            setEndDate(endDate);
            setUsers(users);
            setIsLoading(false);
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

            {
                isLoading ?
                    <div className="text-center mt-8">
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div> :
                    <div>
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
                                        availabilities && availabilities.map((user, i) => (
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
                                                className="bg-x-light-gray border-bottom"
                                            >
                                                <td className="border-y text-vw nowrap">{user.title}</td>
                                                <td className="border-y text-vw nowrap">{user.first_name} {user.last_name}</td>
                                                {
                                                    user.availability.map((time, a_i) => (
                                                        // Only render edit mode for the selected date and employee
                                                        (userData === user.u_id && availabilityIndex === a_i)
                                                            ? renderEditShift(user.u_id, a_i, user.shifts[a_i])
                                                            // Render shifts if they exist during the selected week
                                                            : user.shifts[a_i].shift_end === null
                                                                ? renderBlank(user.u_id, a_i, time)
                                                                : renderShift(user.u_id, a_i, user.shifts[a_i].shift_start, user.shifts[a_i].shift_end)
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    )
}
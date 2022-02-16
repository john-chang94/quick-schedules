import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../services/auth';
import { createPreset, fetchPresets, fetchTimes } from '../../services/presets';
import { createShift, fetchAllUsersSchedulesByDate, fetchAllUsersSchedulesByDateMobile, deleteShift, updateShift, createCopyOfWeeklySchedule } from '../../services/shifts';
import { fetchAllUsersAvailabilities } from '../../services/users';
import { startOfToday, startOfWeek, addWeeks, subWeeks, parseISO, format } from 'date-fns';
import Loader from 'react-loader-spinner';
import { fetchAllRequestsByStatusAndDate } from '../../services/requests';
import { fetchStoreHours } from '../../services/store';
import SchedulesMobile from './schedulesMobile';

export default function AdminSchedules() {
    const [availabilities, setAvailabilities] = useState(null);
    const [users, setUsers] = useState(null);
    const [usersMobile, setUsersMobile] = useState(null);
    const [requests, setRequests] = useState(null);
    const [days, setDays] = useState(null);
    const [times, setTimes] = useState(null);
    const [presets, setPresets] = useState(null);
    const [store, setStore] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    // Used for datepicker
    const [dateISO, setDateISO] = useState(startOfToday())
    // Used for fetching data within dates in ISO string
    const [weekStart, setWeekStart] = useState('');
    const [weekEnd, setWeekEnd] = useState('');
    // Used for getting time values when saving a shift
    const [shift_start_value, setShiftStartValue] = useState('0 0');
    const [shift_end_value, setShiftEndValue] = useState('0 0');
    const [level, setLevel] = useState('');
    // Used to render edit shift mode for selected date and employee only
    const [userData, setUserData] = useState(null);
    const [availabilityIndex, setAvailabilityIndex] = useState(null);

    // For init load and datepicker
    const getDatesOfTheWeek = async (selectedDate) => {
        setIsLoadingSchedule(true);
        let date;
        if (selectedDate) {
            date = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
            setDateISO(selectedDate); // For datepicker value
        }
        else {
            date = startOfWeek(new Date(), { weekStartsOn: 1 });
        }

        let daysArray = [];
        let dateToAdd = date;
        for (let i = 0; i < 7; i++) {
            daysArray.push(dateToAdd.toISOString());
            dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
        }

        const weekStart = daysArray[0];
        const weekEnd = daysArray[6];

        setDays(daysArray);
        setWeekStart(weekStart);
        setWeekEnd(weekEnd);

        // Refresh schedules after date change
        const users = await fetchAllUsersSchedulesByDate(weekStart, weekEnd);
        const usersMobile = await fetchAllUsersSchedulesByDateMobile(weekStart, weekEnd);
        const requests = await fetchAllRequestsByStatusAndDate('Approved', weekStart, weekEnd);

        // Add date labels for mobile schedules display
        for (let i = 0; i < daysArray.length; i++) {
            usersMobile.push({ shift_start: daysArray[i], label: true });
        }
        usersMobile.sort((a, b) => new Date(a.shift_start) - new Date(b.shift_start))
        
        setUsers(users);
        setUsersMobile(usersMobile);
        setRequests(requests);
        setIsLoadingSchedule(false);
    }

    // Can create or update shift based on s_id being provided
    const handleSaveShift = async (u_id, dayIndex, s_id) => {
        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        // Get shift date
        const date = new Date(days[dayIndex]);
        // Get hour and minute in INT data type for date object
        const startTimeHour = parseInt(shift_start_value.split(' ')[0]);
        const startTimeMinute = parseInt(shift_start_value.split(' ')[1]);
        // Get hour and minute in INT data type for date object
        const endTimeHour = parseInt(shift_end_value.split(' ')[0]);
        const endTimeMinute = parseInt(shift_end_value.split(' ')[1]);
        // Create new date objects with year, month, day, hour, minute, and timezone
        const shift_start = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTimeHour,
            startTimeMinute)
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }); // Local timezone

        const shift_end = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTimeHour,
            endTimeMinute)
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });

        const body = { u_id, shift_start, shift_end };
        if (s_id) {
            await updateShift(s_id, body, tokenConfig);
        } else {
            await createShift(body, tokenConfig);
        }

        await handleFetchSchedule();

        setUserData('');
        setAvailabilityIndex('');
        setIsUpdating(false);
    }

    const handleCopyWeeklySchedule = async () => {
        const doCopy = window.confirm('Copy schedule to next week? Any shifts already saved will be overwritten.');
        if (doCopy) {
            setIsCopying(true);
            setIsLoadingSchedule(true);

            let shifts = [];
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < users[i].shifts.length; j++) {
                    if (users[i].shifts[j].shift_end !== null) {
                        let shift = {
                            u_id: users[i].u_id,
                            shift_start: format(addWeeks(parseISO(users[i].shifts[j].shift_start), 1), "yyyy-MM-dd'T'HH:mm:ss"),
                            shift_end: format(addWeeks(parseISO(users[i].shifts[j].shift_end), 1), "yyyy-MM-dd'T'HH:mm:ss")
                        }
                        shifts.push(shift);
                    }
                }
            }

            const body = {
                shifts,
                weekStart: addWeeks(parseISO(weekStart), 1),
                weekEnd: addWeeks(parseISO(weekEnd), 1)
            };


            await createCopyOfWeeklySchedule(body);
            const updatedUsers = await fetchAllUsersSchedulesByDate(weekStart, weekEnd);
            const usersMobile = await fetchAllUsersSchedulesByDateMobile(weekStart, weekEnd);
            setUsers(updatedUsers);
            setUsersMobile(usersMobile);
            // Display following week after copying schedule
            handleNextWeek();
            setIsCopying(false);
        }
    }

    // Refresh schedule after any changes are made
    const handleFetchSchedule = async () => {
        const users = await fetchAllUsersSchedulesByDate(weekStart, weekEnd);
        const usersMobile = await fetchAllUsersSchedulesByDateMobile(weekStart, weekEnd);
        setUsers(users);
        setUsersMobile(usersMobile);
    }

    const handleCancelShift = () => {
        setUserData('');
        setAvailabilityIndex('');
    }

    // Render edit shift (new)
    const handleUserClick = (u_id, index) => {
        setUserData(u_id);
        setAvailabilityIndex(index);
        setShiftStartValue(store.store_open_value);
        setShiftEndValue(store.store_close_value);
    }

    // Render edit shift (update)
    const handleEditShift = (u_id, index, startStartValue, endStartValue) => {
        setUserData(u_id);
        setAvailabilityIndex(index);
        setShiftStartValue(startStartValue);
        setShiftEndValue(endStartValue);
        setLevel(level);
    }

    const handlePreviousWeek = () => {
        let date = subWeeks(new Date(dateISO), 1);
        setDateISO(date);
        getDatesOfTheWeek(date);
        setUserData('');
        setAvailabilityIndex('');
    }

    const handleNextWeek = () => {
        let date = addWeeks(new Date(dateISO), 1);
        setDateISO(date);
        getDatesOfTheWeek(date);
        setUserData('');
        setAvailabilityIndex('');
    }

    const handleSelectPreset = (shiftValue) => {
        if (!shiftValue) return;
        setShiftStartValue(shiftValue.split('-')[0]);
        setShiftEndValue(shiftValue.split('-')[1]);
    }

    const handleSavePreset = async () => {
        const tokenConfig = isAuthenticated();
        let level;
        let shift_start;
        let shift_end;
        for (let i = 0; i < presets.length; i++) {
            if (shift_start_value === presets[i].shift_start_value
                && shift_end_value === presets[i].shift_end_value) {
                alert('Preset already saved');
                return;
            }
        }
        for (let i = 0; i < times.length; i++) {
            if (shift_start_value === times[i].value) {
                // Assign only start time level for sorting when displayed in the list
                level = times[i].level;
                shift_start = times[i].time;
            }
            if (shift_end_value === times[i].value) {
                shift_end = times[i].time;
            }
        }

        const body = { shift_start, shift_end, shift_start_value, shift_end_value, level };
        await createPreset(body, tokenConfig);

        const newPresets = await fetchPresets();
        setPresets(newPresets);

        alert('Preset saved')
    }

    const handleRemoveShift = async (s_id) => {
        const toDelete = window.confirm('Are you sure you want to remove this shift?');
        if (toDelete) {
            const tokenConfig = isAuthenticated();
            setIsUpdating(true);
            await deleteShift(s_id, tokenConfig);

            await handleFetchSchedule();
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

    const renderShift = (u_id, a_i, shift_start, shift_end) => (
        <td
            key={a_i}
            className="pointer schedules-text bg-x-light-green"
            onClick={() => handleEditShift(u_id, a_i, getTimeValue(shift_start), getTimeValue(shift_end))}
        >
            {getTime(shift_start)} -&nbsp;
            {getTime(shift_end)}
        </td>
    )

    const renderBlank = (u_id, a_i, time) => (
        <td
            key={a_i}
            // Keep bg color black if employee is 'N/A' for availability
            className={`pointer ${time.start_time === 'N/A' ? 'bg-black' : 'hovered'}`}
            onClick={() => handleUserClick(u_id, a_i)}
        ></td>
    )

    const renderEditShift = (u_id, dayIndex, shift) => (
        <td key={dayIndex}>
            <div className="flex justify-evenly mt-1">
                <p>Preset</p>
                <select
                    className="w-60 schedules-text"
                    defaultValue='0 0'
                    disabled={isUpdating}
                    onChange={({ target }) => handleSelectPreset(target.value)}
                >
                    <option value="">Select</option>
                    {
                        presets && presets.map((preset, i) => (
                            <option key={i} value={`${preset.shift_start_value}-${preset.shift_end_value}`}>
                                {preset.shift_start} - {preset.shift_end}
                            </option>
                        ))
                    }
                </select>
            </div>
            <hr className="my-1" />
            <div className="flex justify-evenly mb-1">
                <p>Start</p>
                <select
                    className="w-60 schedules-text"
                    value={shift_start_value}
                    disabled={isUpdating}
                    onChange={({ target }) => setShiftStartValue(target.value)}>
                    {
                        times && times.map((time, i) => (
                            <option
                                key={i}
                                value={time.value}
                                disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                            >
                                {time.time}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className="flex justify-evenly mb-1">
                <p className="mr-1">End</p>
                <select
                    className="w-60 schedules-text"
                    value={shift_end_value}
                    disabled={isUpdating}
                    onChange={({ target }) => setShiftEndValue(target.value)}>
                    {
                        times && times.map((time, i) => (
                            <option
                                key={i}
                                value={time.value}
                                disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                            >
                                {time.time}
                            </option>
                        ))
                    }
                </select>
            </div>
            {
                isUpdating ?
                    <div className="my-1">
                        <Loader
                            type='ThreeDots'
                            color='rgb(50, 110, 150)'
                            height={12}
                        />
                    </div>
                    : <div className="my-2 w-100 flex justify-evenly">
                        <div
                            className="p-1 w-100 pointer hovered border-solid-1"
                            onClick={() => handleSaveShift(u_id, dayIndex, shift.s_id)}
                        >
                            <i className="fas fa-check schedules-text"></i>
                        </div>
                        <div
                            className="p-1 w-100 pointer hovered border-solid-1"
                            onClick={() => handleSavePreset()}
                        >
                            <i className="fas fa-star schedules-text"></i>
                        </div>
                        <div
                            className="p-1 w-100 pointer hovered border-solid-1"
                            onClick={() => shift.s_id ? handleRemoveShift(shift.s_id) : handleCancelShift()}
                        >
                            {
                                shift.shift_end === null
                                    ? <i className="fas fa-times schedules-text"></i>
                                    : <i className="fas fa-trash-alt schedules-text"></i>
                            }
                        </div>
                    </div>
            }
        </td>
    )

    const renderAvailability = () => (
        <div className="availability">
            <h3 className="text-center">Availability</h3>
            <table className="border-collapse w-100 text-center schedules-text">
                <thead>
                    <tr>
                        <th>Name</th>
                        {
                            // Render the day only
                            days && days.map((day, i) => (
                                <th key={i}>
                                    <p>{new Date(day).toString().split(' ')[0]}</p>
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
                                style={i % 2 === 0
                                    ? { backgroundColor: 'rgb(235, 235, 235)' }
                                    : { backgroundColor: 'rbg(255, 255, 255)' }}
                            >
                                <td>
                                    <p>
                                        <strong>{user.first_name} {user.last_name}</strong>
                                    </p>
                                    <em>{user.level === 2 ? "A. Manager" : user.title}</em>
                                </td>
                                {
                                    user.availability.map((time, i) => (
                                        <td key={i} className={`${time.start_time === 'N/A' && 'bg-black'}`}>
                                            {(time.start_time === 'ANY' && time.end_time === 'ANY') ? 'ANY' : `${time.start_time} - ${time.end_time}`}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )

    const renderController = () => (
        <div className="schedules-controller">
            <div className="select-week">
                <div className="pointer" onClick={() => handlePreviousWeek()}>
                    <em className="text-3">Prev&nbsp;week</em>
                    <p>
                        <i className="fas fa-angle-double-left"></i>
                    </p>
                </div>
                <div id="controller-date" className="relative">
                    <input
                        type="date"
                        value={new Date(dateISO).toISOString().split('T')[0]} // Init date must be yyyy-mm-dd format
                        onChange={({ target }) => getDatesOfTheWeek(target.value)}
                    />
                    <div className="absolute">&nbsp;</div>
                </div>
                <div className="pointer" onClick={() => handleNextWeek()}>
                    <em className="text-3">Next&nbsp;week</em>
                    <p>
                        <i className="fas fa-angle-double-right"></i>
                    </p>
                </div>
            </div>

            <div className="schedules-requests">
                <div className="mr-5">
                    <p className="text-3">
                        <strong>Approved Requests</strong>
                    </p>
                    {
                        requests.length
                            ? requests.map((request, i) => (
                                <div key={i}>
                                    <p className="text-3">
                                        {request.first_name} {request.last_name}:
                                        {request.requested_dates.map((date, r_i) => (
                                            <span key={r_i}>
                                                &nbsp;
                                                {
                                                    r_i === request.requested_dates.length - 1
                                                        ? new Date(date).toLocaleDateString()
                                                        : `${new Date(date).toLocaleDateString()},`
                                                }
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            ))
                            : <p className="text-3">None</p>
                    }
                </div>
                <div>
                    <button
                        className={`btn-med ${isCopying ? '' : 'btn-hovered'}`}
                        onClick={() => handleCopyWeeklySchedule()}
                        disabled={isCopying}
                    >
                        <i className="fas fa-share" />&nbsp;Copy
                    </button>
                </div>
            </div>
        </div>
    )

    const renderSchedule = () => (
        <table className="schedules-table w-100 border-collapse text-center table-fixed schedules-text">
            <tbody>
                    <tr>
                        <td className="bg-x-light-gray">
                            <strong>Name</strong>
                        </td>
                        {
                            days && days.map((day, i) => (
                                <td key={i} className="bg-x-light-gray">
                                    <strong>{new Date(day).toString().split(' ')[0]}</strong>
                                    <p><em>{new Date(day).toLocaleDateString()}</em></p>
                                </td>
                            ))
                        }
                    </tr>
                    {
                        users && users.map((user, u_i) => (
                            <tr key={u_i}>
                                <td className="py-1">
                                    <p>
                                        <strong>{user.first_name} {user.last_name}</strong>
                                    </p>
                                    <em>{user.level === 2 ? "A. Manager" : user.title}</em>
                                </td>
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
    )

    useEffect(() => {
        async function getDatesAndLoadData() {
            const times = await fetchTimes();
            const availabilities = await fetchAllUsersAvailabilities();
            const presets = await fetchPresets();
            const store = await fetchStoreHours();
            await getDatesOfTheWeek();

            setTimes(times);
            setAvailabilities(availabilities);
            setPresets(presets);
            setStore(store);
            setShiftStartValue(store.store_open_value);
            setShiftEndValue(store.store_close_value);
            setIsLoadingSchedule(false);
        }

        getDatesAndLoadData();
    }, [])

    return (
        <>
            {
                isLoadingSchedule ?
                    <div className="text-center" style={{ marginTop: '70px' }}>
                        <Loader
                            type='Oval'
                            color='rgb(50, 110, 150)'
                        />
                    </div>
                    : <div>
                        {renderController()}
                        {renderSchedule()}
                        {renderAvailability()}
                        <SchedulesMobile
                            usersMobile={usersMobile}
                            days={days}
                            times={times}
                            store={store}
                            presets={presets}
                            getTimeValue={getTimeValue}
                            handleFetchSchedule={handleFetchSchedule}
                        />
                    </div>
            }
        </>
    )
}
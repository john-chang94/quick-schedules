import React, { useState } from "react";
import { format, toDate, parseISO } from "date-fns";
import { isAuthenticated } from "../../services/auth";
import { createShift, updateShift, deleteShift } from "../../services/shifts";
import Loader from "react-loader-spinner";
import Modal from "react-modal";

Modal.setAppElement('#root');

export default function SchedulesMobile({ usersMobile, users, days, times, presets, store, getTimeValue, handleFetchSchedule }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [editShiftIndex, setEditShiftIndex] = useState(null);
    const [dayIndex, setDayIndex] = useState(null); // For saving a shift
    const [u_id, setUId] = useState(null);
    const [date, setDate] = useState("");
    const [shiftStartValue, setShiftStartValue] = useState("");
    const [shiftEndValue, setShiftEndValue] = useState("");
    const [showAddShift, setShowAddShift] = useState(false);
    const [error, setError] = useState("");

    const handleEditShift = (user, shiftIndex) => {
        // Set specific shift time values to match with times array in the select inputs
        setShiftStartValue(getTimeValue(user.shift_start));
        setShiftEndValue(getTimeValue(user.shift_end));
        // Enable edit shift component to render
        setEditShiftIndex(shiftIndex);
        // Get date to be saved when submitting
        for (let i = 0; i < days.length; i++) {
            // Use format for mobile, otherwise shifts will return one day after (ㆆ_ㆆ)
            if (format(new Date(user.shift_start), "yyyy-MM-dd") === days[i].split("T")[0]) {
                setDayIndex(i);
            }
        }
    }

    const handleCreateShift = async () => {
        // Return error if form is not filled out
        if (!u_id || !date || !shiftStartValue || !shiftEndValue) {
            return setError("Employee and shift required");
        }

        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        const newDate = toDate(parseISO(date));

        // Get hour and minute in INT data type for date object
        const startTimeHour = parseInt(shiftStartValue.split(' ')[0]);
        const startTimeMinute = parseInt(shiftStartValue.split(' ')[1]);
        // Get hour and minute in INT data type for date object
        const endTimeHour = parseInt(shiftEndValue.split(' ')[0]);
        const endTimeMinute = parseInt(shiftEndValue.split(' ')[1]);
        // Create new date objects with year, month, day, hour, minute, and timezone
        const shift_start = toDate(new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            startTimeHour,
            startTimeMinute))
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }); // Local timezone

        const shift_end = toDate(new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
            endTimeHour,
            endTimeMinute))
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });

        const body = { u_id, shift_start, shift_end };
        await createShift(body, tokenConfig);

        await handleFetchSchedule();

        setEditShiftIndex(null);
        setIsUpdating(false);
        setShowAddShift(false);
    }

    const handleSaveShift = async (u_id, s_id) => {
        setIsUpdating(true);
        const tokenConfig = isAuthenticated();
        // Get shift date
        const date = toDate(new Date(days[dayIndex]));

        // Get hour and minute in INT data type for date object
        const startTimeHour = parseInt(shiftStartValue.split(' ')[0]);
        const startTimeMinute = parseInt(shiftStartValue.split(' ')[1]);
        // Get hour and minute in INT data type for date object
        const endTimeHour = parseInt(shiftEndValue.split(' ')[0]);
        const endTimeMinute = parseInt(shiftEndValue.split(' ')[1]);
        // Create new date objects with year, month, day, hour, minute, and timezone
        const shift_start = toDate(new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTimeHour,
            startTimeMinute))
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }); // Local timezone

        const shift_end = toDate(new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTimeHour,
            endTimeMinute))
            .toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });

        const body = { u_id, shift_start, shift_end };
        await updateShift(s_id, body, tokenConfig);

        await handleFetchSchedule();

        setEditShiftIndex(null);
        setIsUpdating(false);
    }

    const handleRemoveShift = async (s_id) => {
        const toDelete = window.confirm('Are you sure you want to remove this shift?');
        if (toDelete) {
            const tokenConfig = isAuthenticated();
            setIsUpdating(true);
            await deleteShift(s_id, tokenConfig);

            await handleFetchSchedule();
            setEditShiftIndex(null);
            setIsUpdating(false);
        }
    }

    const handleSelectPreset = (shiftValue) => {
        if (!shiftValue) return;
        setShiftStartValue(shiftValue.split('-')[0]);
        setShiftEndValue(shiftValue.split('-')[1]);
    }

    const handleCancelAddShift = () => {
        setShiftStartValue("");
        setShiftEndValue("");
        setUId("");
        setError("");
        setShowAddShift(false);
    }

    const renderShift = (user, shiftIndex) => (
        <div onClick={() => handleEditShift(user, shiftIndex)}>
            <p>
                {new Date(user.shift_start).toLocaleTimeString().replace(":00 ", " ")} -&nbsp;
                {new Date(user.shift_end).toLocaleTimeString().replace(":00 ", " ")}
            </p>
            <p><strong>{user.first_name} {user.last_name}</strong></p>
            <p><em>{user.title}</em></p>
        </div>
    )

    const renderEditShift = (user) => (
        <>
            <div className="flex justify-evenly">
                <div className="flex flex-col flex-center text-center">
                    <p className="schedules-mobile-text"><strong>{user.first_name} {user.last_name}</strong></p>
                    <p className="schedules-mobile-text"><em>{user.title}</em></p>
                </div>
                <div>
                    <div className="flex justify-evenly mb-1">
                        <p className="mr-1 schedules-mobile-text">Preset</p>
                        <select
                            defaultValue='0 0'
                            disabled={isUpdating}
                            onChange={({ target }) => handleSelectPreset(target.value)}
                        >
                            <option value="">Select</option>
                            {presets && presets.map((preset, i) => (
                                    <option key={i} value={`${preset.shift_start_value}-${preset.shift_end_value}`}>
                                        {preset.shift_start} - {preset.shift_end}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex justify-evenly mb-1">
                        <p className="mr-1 schedules-mobile-text">Start</p>
                        <select
                            value={shiftStartValue}
                            disabled={isUpdating}
                            onChange={({ target }) => setShiftStartValue(target.value)}>
                            {times && times.map((time, i) => (
                                    <option
                                        key={i}
                                        value={time.value}
                                        disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                                    >
                                        {time.time}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex justify-evenly mb-1">
                        <p className="mr-1 schedules-mobile-text">End</p>
                        <select
                            value={shiftEndValue}
                            disabled={isUpdating}
                            onChange={({ target }) => setShiftEndValue(target.value)}>
                            {times && times.map((time, i) => (
                                    <option
                                        key={i}
                                        value={time.value}
                                        disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                                    >
                                        {time.time}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>
            {
                isUpdating ?
                    <div className="my-1 text-center">
                        <Loader
                            type='ThreeDots'
                            color='rgb(50, 110, 150)'
                            height={12}
                        />
                    </div>
                    : <div className="w-100 flex justify-evenly">
                        <div
                            className="py-1 w-100 text-center pointer hovered border-solid-1"
                            onClick={() => handleSaveShift(user.u_id, user.s_id)}
                        >
                            <i className="fas fa-check"></i>
                        </div>
                        <div
                            className="py-1 w-100 text-center pointer hovered border-solid-1"
                            onClick={() => handleRemoveShift(user.s_id)}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </div>
                        <div
                            className="py-1 w-100 text-center pointer hovered border-solid-1"
                            onClick={() => setEditShiftIndex(null)}
                        >
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
            }
        </>
    )

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    const renderAddShift = () => (
        showAddShift ? (
            <Modal
                isOpen={showAddShift}
                style={customStyles}
                onRequestClose={() => setShowAddShift(false)}
                shouldCloseOnOverlayClick={true}
            >
                <div className="add-shift-mobile text-center">
                    <div className="flex my-2">
                        <p className="mr-1 schedules-mobile-text">Date</p>
                        <input type="date" onChange={({ target }) => setDate(target.value)} />
                    </div>
                    <div className="flex my-2">
                        <p className="mr-1 schedules-mobile-text">Employee</p>
                        <select onChange={({ target }) => setUId(target.value)}>
                            <option value="">Select...</option>
                            {users.map((user, i) => (
                                <option key={i} value={user.u_id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex my-2">
                        <p className="mr-1 schedules-mobile-text">Preset</p>
                        <select
                            defaultValue='0 0'
                            disabled={isUpdating}
                            onChange={({ target }) => handleSelectPreset(target.value)}
                        >
                            <option value="">Select</option>
                            {presets && presets.map((preset, i) => (
                                    <option key={i} value={`${preset.shift_start_value}-${preset.shift_end_value}`}>
                                        {preset.shift_start} - {preset.shift_end}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex my-2">
                        <p className="mr-1 schedules-mobile-text">Start</p>
                        <select
                            value={shiftStartValue}
                            disabled={isUpdating}
                            onChange={({ target }) => setShiftStartValue(target.value)}>
                            {times && times.map((time, i) => (
                                    <option
                                        key={i}
                                        value={time.value}
                                        disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                                    >
                                        {time.time}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex my-2">
                        <p className="mr-1 schedules-mobile-text">End</p>
                        <select
                            value={shiftEndValue}
                            disabled={isUpdating}
                            onChange={({ target }) => setShiftEndValue(target.value)}>
                            {times && times.map((time, i) => (
                                    <option
                                        key={i}
                                        value={time.value}
                                        disabled={time.level < parseFloat(store.store_open_level) || time.level > parseFloat(store.store_close_level)}
                                    >
                                        {time.time}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {error && <p className="red schedules-mobile-text">{error}</p>}
                    <div className="my-2">
                        <button className="btn-med hovered m-1" onClick={() => handleCreateShift(u_id)}>Save</button>
                        <button className="btn-med hovered m-1" onClick={handleCancelAddShift}>Cancel</button>
                    </div>
                </div>
            </Modal>
        ) : (
            <div className="add-shift-btn flex flex-center" onClick={() => setShowAddShift(true)}>
                <p className="white text-7"><i className="fas fa-plus" /></p>
            </div>
        )
    )
    
    return (
        <div className="schedules-mobile">
            {renderAddShift()}
            {
                usersMobile.map((user, i) => (
                    <div key={i}>
                        {user.label ? (
                            <div className="w-100 border-x bg-x-light-gray text-center">
                                <p><strong>{format(new Date(user.shift_start), "PP")}</strong></p>
                            </div>
                        ) : (
                            <div className="flex">
                                <div className="flex flex-col flex-center border-solid-1 p-1" style={{ width: "20%" }}>
                                    <p><strong>{new Date(user.shift_start).toDateString().split(" ")[0]}</strong></p>
                                    <p><strong>{new Date(user.shift_start).toDateString().split(" ")[2]}</strong></p>
                                </div>
                                <div className="w-80 border-solid-1 p-1">
                                    {editShiftIndex === i
                                        ? renderEditShift(user)
                                        : renderShift(user, i)
                                    }
                                    
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

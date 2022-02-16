import React, { useState } from "react";
import { format } from "date-fns";
import { isAuthenticated } from "../../services/auth";
import { createShift, updateShift, deleteShift } from "../../services/shifts";
import Loader from "react-loader-spinner";

export default function SchedulesMobile({ usersMobile, days, times, store, shift_start_value, shift_end_value, setShiftStartValue, setShiftEndValue, handleFetchSchedule }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [editShiftIndex, setEditShiftIndex] = useState(null);
    const [dayIndex, setDayIndex] = useState(null);

    const handleEditShift = (user, shiftIndex) => {
        setEditShiftIndex(shiftIndex);
        for (let i = 0; i < days.length; i++) {
            if (user.shift_start.split("T")[0] === days[i].split("T")[0]) {
                setDayIndex(i);
            }
        }
    }

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

        handleFetchSchedule();

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
            setIsUpdating(false);
        }
    }

    const renderEditShift = (user) => (
        <>
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
                            onClick={() => handleSaveShift(user.u_id, dayIndex, user.s_id)}
                        >
                            <i className="fas fa-check schedules-text"></i>
                        </div>
                        <div
                            className="p-1 w-100 pointer hovered border-solid-1"
                            onClick={() => handleRemoveShift(user.s_id)}
                        >
                            <i className="fas fa-trash-alt schedules-text"></i>
                        </div>
                        <div
                            className="p-1 w-100 pointer hovered border-solid-1"
                            onClick={() => setEditShiftIndex(null)}
                        >
                            <i className="fas fa-times schedules-text"></i>
                        </div>
                    </div>
            }
        </>
    )

    const renderShift = (user, shiftIndex) => (
        <div onClick={() => handleEditShift(user, shiftIndex)} className="flex">
            <div className="flex flex-col flex-center border-solid-1 p-1" style={{ width: "20%" }}>
                <p><strong>{new Date(user.shift_start).toDateString().split(" ")[0]}</strong></p>
                <p><strong>{new Date(user.shift_start).toDateString().split(" ")[2]}</strong></p>
            </div>
            <div className="w-80 border-solid-1 p-2">
                {editShiftIndex === shiftIndex ? (
                    <div>
                        {renderEditShift(user)}
                        <p>
                            {user.first_name} {user.last_name}
                        </p>
                    </div>
                ) : (
                    <>
                        <p>
                            {new Date(user.shift_start).toLocaleTimeString().replace(":00 ", " ")} - 
                            {new Date(user.shift_end).toLocaleTimeString().replace(":00 ", " ")}
                        </p>
                        <p><strong>{user.first_name} {user.last_name}</strong></p>
                        <p><em>{user.title}</em></p>
                    </>
                )}
                
            </div>
        </div>
    )

    const renderSchedule = () => (
        <div className="schedules-mobile">
            {
                usersMobile.map((user, i) => (
                    <div key={i}>
                        {user.label ? (
                            <div className="w-100 border-x bg-x-light-gray text-center">
                                <p><strong>{format(new Date(user.shift_start), "PP")}</strong></p>
                            </div>
                        ) : (
                            renderShift(user, i)
                        )}
                    </div>
                ))
            }
        </div>
    )
    
    return (
        renderSchedule()
    )
}

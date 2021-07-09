import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { fetchTimes } from '../../services/presets';
import { fetchUsersAndAvailabilities } from '../../services/users';

export default function AdminSchedules() {
    const [users, setUsers] = useState(null);
    const [date, setDate] = useState(null);
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState(null);
    const [showEditShift, setShowEditShift] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userIndex, setUserIndex] = useState(null);

    const handleSaveShift = () => {

    }

    const handleUserClick = (user, index) => {
        setUserData(user.u_id);
        setUserIndex(index);
        // setShowEditShift(true);
    }

    const renderEditShift = () => (
        <div>
            <select>
                {
                    times && times.map((time, i) => (
                        <option key={i} value={time.value}>
                            {time.time}
                        </option>
                    ))
                }
            </select>
        </div>
    )

    useEffect(() => {
        async function getData() {
            const users = await fetchUsersAndAvailabilities();
            const times = await fetchTimes();
            setUsers(users);
            setTimes(times);
        }

        getData();
    }, [])

    // Get dates for the week (Mon - Sun) based on the current day
    useEffect(() => {
        // Current date
        let date = new Date(Date.now())
        // Get Monday of the week, getDate returns 1-31, getDay returns 0-6
        let mondayOfTheWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        // Assign date for Monday of the week to firstDate, setDate requires 1-31
        let firstDate = new Date(date.setDate(mondayOfTheWeek))
        let daysArray = []

        for (let i = 0; i < 7; i++) {
            // Starting on Monday, add 0-6 each loop to increment the date
            // then turn into a date object to add to array
            let day = new Date(date.setDate(firstDate.getDate() + i));
            daysArray.push(day);
        }

        setDays(daysArray);
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
                                        ? { backgroundColor: 'rgb(240, 240, 240)' }
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
                            users && users.map((user, i) => (
                                <tr
                                    key={i}
                                    className="border-bottom"
                                    style={i % 2 === 0
                                        ? { backgroundColor: 'rgb(240, 240, 240)' }
                                        : { backgroundColor: 'rbg(255, 255, 255)' }}
                                >
                                    <td className="border-y text-vw nowrap px-1">{user.title}</td>
                                    <td className="border-y text-vw nowrap px-1">{user.first_name} {user.last_name}</td>
                                    {
                                        user.availability.map((time, i) => (
                                            <>
                                                {
                                                    (userData === user.u_id && userIndex === i) ?
                                                    renderEditShift() :
                                                    <td
                                                        className={`border-y text-vw nowrap px-1 ${time === 'NA' && 'bg-black'}`}
                                                        onClick={() => handleUserClick(user, i)}
                                                    >

                                                    </td>
                                                }
                                            </>
                                        ))
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
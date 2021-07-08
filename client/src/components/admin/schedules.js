import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { fetchUsersAndAvailabilities } from '../../services/users';

export default function AdminSchedules() {
    const [users, setUsers] = useState(null);
    const [date, setDate] = useState(null);
    const [days, setDays] = useState([]);

    useEffect(() => {
        async function getUsersAndAvailabilities() {
            const users = await fetchUsersAndAvailabilities();
            setUsers(users);
        }

        getUsersAndAvailabilities();
    }, [])

    // Set dates for the week (Mon - Sun) based on the current day
    useEffect(() => {
        // Current date
        let date = new Date(Date.now())
        // Get Monday of the week, getDate => 1-31, getDay => 0-6
        let mondayOfTheWeek = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        // Assign date for Monday of the week to firstDate, setDate requires 1-31
        let firstDate = new Date(date.setDate(mondayOfTheWeek))
        let daysArray = []

        for (let i = 0; i < 7; i++) {
            // Starting on Monday, add 0-6 each loop to increment the date being added
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
                <table id="availability-table" className="border-collapse w-100 text-center">
                    <thead>
                        <tr className="border-bottom">
                            <th className="p-2">Role</th>
                            <th className="p-2">Name</th>
                            {
                                days && days.map((day, i) => (
                                    <th key={i} className="p-2">
                                        <p>{day.toString().split(' ')[0]}</p>
                                        {/* <em>{day.toLocaleDateString()}</em> */}
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
                                    <td className="text-vw">{user.title}</td>
                                    <td className="text-vw">{user.first_name} {user.last_name}</td>
                                    {
                                        user.availability.map((time, i) => (
                                            <td key={i} className="text-vw">{time}</td>
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
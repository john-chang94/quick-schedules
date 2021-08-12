import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Loader from 'react-loader-spinner';
import { fetchAllUsersSchedulesByDate } from '../../services/shifts';
import { startOfWeek } from 'date-fns';

export default function UserSchedules() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState(null);
    const [days, setDays] = useState(null);

    const getTime = (shift) => {
        return new Date(shift).toLocaleTimeString().replace(':00 ', ' ');
    }

    const renderBlank = (a_i, time) => (
        <td
            key={a_i}
            // Keep bg color black if employee is 'N/A' for availability
            className={`border-x nowrap h-10 ${time.start_time === 'N/A' ? 'bg-black' : 'bg-x-light-gray'}`}
        ></td>
    )

    const renderShift = (a_i, shift_start, shift_end) => (
        <td
            key={a_i}
            className="border-x nowrap h-10 bg-x-light-gray"
        >
            {getTime(shift_start)} -&nbsp;
            {getTime(shift_end)}
        </td>
    )

    useEffect(() => {
        async function getData() {
            let daysArray = [];
            let dateToAdd = startOfWeek(new Date(), { weekStartsOn: 1 });
            for (let i = 0; i < 7; i++) {
                daysArray.push(dateToAdd.toISOString());
                dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
            }

            const users = await fetchAllUsersSchedulesByDate(daysArray[0], daysArray[6]);
            setDays(daysArray);
            setUsers(users);
            setIsLoading(false);
        }

        getData();
    }, [])

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
                    : <div className="mt-5">
                        <table className="w-100 mt-1 border-collapse text-center">
                            <tbody>
                                <tr className="border-bottom">
                                    <td><strong>Role</strong></td>
                                    <td><strong>Name</strong></td>
                                    {
                                        days && days.map((day, i) => (
                                            <td key={i}>
                                                <strong>{new Date(day).toString().split(' ')[0]}</strong>
                                                <p><em>{new Date(day).toLocaleDateString()}</em></p>
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
                                            <td className="border-x nowrap">{user.title}</td>
                                            <td className="border-x nowrap">{user.first_name} {user.last_name}</td>
                                            {
                                                user.availability.map((time, a_i) => (
                                                    user.shifts[a_i].shift_end === null
                                                        ? renderBlank(a_i, time)
                                                        : renderShift(a_i, user.shifts[a_i].shift_start, user.shifts[a_i].shift_end)
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
            }
        </div>
    )
}